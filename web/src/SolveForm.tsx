import { FC } from "react";
import { SolveRow } from "./data/interface";

type SolveFormProps = {
  onSubmit: (name: string, solveRows: SolveRow[]) => void;
};

const blank = "⬜";
const green = "🟩";
const yellow = "🟨";

const parseRow = (row: string): SolveRow => {
  return [...row].map((cell) => {
    switch (cell) {
      case green:
        return "G";
      case yellow:
        return "Y";
      default:
        return "";
    }
  }) as SolveRow;
};

const extractSolveRowStrings = (solve: string): string[] => {
  return solve
    .split("\n")
    .map((row) => row.trim())
    .filter(
      (row) =>
        row.includes(green) || row.includes(yellow) || row.includes(blank)
    );
};

export const SolveForm: FC<SolveFormProps> = ({ onSubmit }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const name = (form.elements.namedItem("name") as HTMLInputElement)
          .value;
        const solve = (form.elements.namedItem("solve") as HTMLTextAreaElement)
          .value;
        const solveRows = extractSolveRowStrings(solve).map(parseRow);
        onSubmit(name, solveRows);
      }}
    >
      <label>
        Name:
        <input type="text" name="name" />
      </label>
      <label>
        Solve:
        <textarea name="solve" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};
