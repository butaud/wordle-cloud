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
