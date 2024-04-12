export type SolveRowItem = "" | "G" | "Y";
export type SolveRow = [
  SolveRowItem,
  SolveRowItem,
  SolveRowItem,
  SolveRowItem,
  SolveRowItem
];
export type Solve = {
  id: number;
  puzzleId: number;
  name: string;
  solveRows: SolveRow[];
};
export interface IPuzzleDao {
  init(): Promise<void>;
  getPuzzle(date: Date): Promise<number>;
  getSolves(puzzleId: number): Promise<Solve[]>;
  createSolve(puzzleId: number, solve: Omit<Solve, "id">): Promise<Solve>;
  clearSolves(): Promise<void>;
}
