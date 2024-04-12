import { Solve, SolveRow, SolveRowItem, IPuzzleDao } from "./interface";
import sqlite3 from "sqlite3";

export class SqlitePuzzleDao implements IPuzzleDao {
  private db: sqlite3.Database;
  constructor() {
    // initialize sqlite database
    this.db = new sqlite3.Database("./bin/my_database.db");
  }

  private getPuzzleForDate(date: Date): Promise<number | undefined> {
    const dateStr = date.toISOString().split("T")[0];
    return new Promise((resolve, reject) => {
      this.db.get(
        "SELECT id FROM puzzles WHERE date = ?",
        dateStr,
        (err, row: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(row?.id);
          }
        }
      );
    });
  }

  private createPuzzleForDate(date: Date, puzzleId: number): Promise<void> {
    const dateStr = date.toISOString().split("T")[0];
    return new Promise((resolve, reject) => {
      this.db.run(
        "INSERT INTO puzzles (id, date) VALUES (?, ?)",
        puzzleId,
        dateStr,
        (err: any) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  async getPuzzle(date: Date): Promise<number> {
    let puzzleId = await this.getPuzzleForDate(date);
    if (!puzzleId) {
      // get the last puzzle id inserted and its date
      const lastPuzzle: any = await new Promise((resolve, reject) => {
        this.db.get(
          "SELECT id, date FROM puzzles ORDER BY id DESC LIMIT 1",
          (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve(row);
            }
          }
        );
      });
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

  private getRowsForSolver(solveId: number): Promise<SolveRow[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        "SELECT * FROM solve_rows WHERE solve_id = ?",
        solveId,
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows.map((row: any) => JSON.parse(row.row) as SolveRow));
          }
        }
      );
    });
  }

  getSolves(puzzleId: number): Promise<Solve[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        "SELECT * FROM solves WHERE puzzle_id = ?",
        puzzleId,
        async (err, rows: any[]) => {
          if (err) {
            reject(err);
          } else {
            const solves: Solve[] = [];
            for (const row of rows) {
              const solveId = row.id;
              const solveRows = await this.getRowsForSolver(solveId);
              solves.push({
                id: solveId,
                puzzleId,
                name: row.name,
                solveRows,
              });
            }
            resolve(solves);
          }
        }
      );
    });
  }

  createSolve(
    puzzleId: number,
    solve: Omit<Solve, "id" | "puzzleId">
  ): Promise<Solve> {
    const db = this.db;
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO solves (puzzle_id, name) VALUES (?, ?)",
        puzzleId,
        solve.name,
        function (this: sqlite3.RunResult, err: any) {
          if (err) {
            reject(err);
          } else {
            const solveId = this.lastID;
            const solveRows = solve.solveRows.map((row) => JSON.stringify(row));
            const stmt = db.prepare(
              "INSERT INTO solve_rows (solve_id, row) VALUES (?, ?)"
            );
            for (const row of solveRows) {
              stmt.run(solveId, row);
            }
            stmt.finalize((err) => {
              if (err) {
                reject(err);
              } else {
                resolve({
                  id: solveId,
                  puzzleId,
                  name: solve.name,
                  solveRows: solve.solveRows,
                });
              }
            });
          }
        }
      );
    });
  }
}
