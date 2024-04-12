import { Solve } from "./interface";

export class PuzzleClient {
  private baseUrl: string;
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getPuzzle(date: Date): Promise<number> {
    const dateStr = date.toISOString().split("T")[0];
    const response = await fetch(`${this.baseUrl}/puzzle?date=${dateStr}`);
    const puzzleId = await response.json();
    return puzzleId;
  }

  async getSolves(puzzleId: number): Promise<Solve[]> {
    const response = await fetch(`${this.baseUrl}/solves?puzzleId=${puzzleId}`);
    const solves = await response.json();
    return solves;
  }

  async createSolve(
    puzzleId: number,
    solve: Omit<Solve, "id">
  ): Promise<Solve> {
    const response = await fetch(
      `${this.baseUrl}/solves?puzzleId=${puzzleId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(solve),
      }
    );
    const newSolve = await response.json();
    return newSolve;
  }

  async clearSolves(): Promise<void> {
    await fetch(`${this.baseUrl}/solves`, {
      method: "DELETE",
    });
  }
}
