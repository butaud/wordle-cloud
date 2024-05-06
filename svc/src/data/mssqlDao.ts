import sql from "mssql";

import { Solve, SolveRow, IPuzzleDao } from "./interface";

export class MssqlPuzzleDao implements IPuzzleDao {
  async init(): Promise<void> {
    const database = process.env.WORDLE_DB_NAME;
    const password = process.env.WORDLE_DB_PASSWORD;
    await sql.connect(
      `Driver={ODBC Driver 18 for SQL Server};Server=tcp:wordle-cloud-db-server.database.windows.net,1433;Database=${database};Uid=cabutaud;Pwd=${password};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;`
    );
  }

  private async getPuzzleForDate(date: Date): Promise<number | undefined> {
    const dateStr = date.toISOString().split("T")[0];
    const result = await sql.query<{ id: number }>`
        SELECT id FROM puzzles WHERE date = ${dateStr}
        `;
    return result.recordset[0]?.id;
  }

  private async createPuzzleForDate(
    date: Date,
    puzzleId: number
  ): Promise<void> {
    const dateStr = date.toISOString().split("T")[0];
    await sql.query`
        INSERT INTO puzzles (id, date) VALUES (${puzzleId}, ${dateStr})
        `;
  }

  async getPuzzle(date: Date): Promise<number> {
    let puzzleId = await this.getPuzzleForDate(date);
    if (!puzzleId) {
      // get the last puzzle id inserted and its date
      const lastPuzzle = (
        await sql.query<{ id: number; date: string }>`
            SELECT id, date FROM puzzles ORDER BY id DESC OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY
            `
      ).recordset[0];
      const lastPuzzleDate = new Date(lastPuzzle.date);
      // calculate the difference in days between the last puzzle date and the current date
      const diffDays = Math.floor(
        (date.getTime() - lastPuzzleDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      puzzleId = (lastPuzzle.id as number) + diffDays;
      await this.createPuzzleForDate(date, puzzleId);
    }
    return puzzleId;
  }

  private async getRowsForSolver(solveId: number): Promise<SolveRow[]> {
    const result = await sql.query<{ row: string }>`
        SELECT row FROM solve_rows WHERE solve_id = ${solveId}
        `;
    return result.recordset.map((row) => JSON.parse(row.row) as SolveRow);
  }

  async getSolves(puzzleId: number): Promise<Solve[]> {
    const result = await sql.query<{ id: number; name: string }>`
        SELECT id, name FROM solves WHERE puzzle_id = ${puzzleId}
        `;
    const solves: Solve[] = [];
    for (const row of result.recordset) {
      const solveId = row.id;
      const solveRows = await this.getRowsForSolver(solveId);
      solves.push({
        id: solveId,
        puzzleId,
        name: row.name,
        solveRows,
      });
    }
    return solves;
  }

  async createSolve(
    puzzleId: number,
    solve: Omit<Solve, "id" | "puzzleId">
  ): Promise<Solve> {
    const result = await sql.query`
        INSERT INTO solves (puzzle_id, name) OUTPUT Inserted.ID VALUES (${puzzleId}, ${solve.name})
        `;
    const solveId = result.recordset[0].ID;
    const solveRows = solve.solveRows.map((row) => JSON.stringify(row));
    const stmt = new sql.PreparedStatement();
    stmt.input("solve_id", sql.Int);
    stmt.input("row", sql.NVarChar);
    await stmt.prepare(
      "INSERT INTO solve_rows (solve_id, row) VALUES (@solve_id, @row)"
    );
    for (const row of solveRows) {
      await stmt.execute({ solve_id: solveId, row });
    }
    await stmt.unprepare();
    return {
      id: solveId,
      puzzleId,
      name: solve.name,
      solveRows: solve.solveRows,
    };
  }

  async clearSolves(): Promise<void> {
    await sql.query`DELETE FROM solves`;
    await sql.query`DELETE FROM solve_rows`;
  }
}
