import { FC, useState } from "react";
import { SolveRow } from "./data/interface";

import "./SolveForm.css";

type SolveFormProps = {
  solveTextFromUrl: string | null;
  cachedName: string | null;
  onSubmit: (name: string, solveRows: SolveRow[]) => void;
};

const blank = "⬜";
const blankDark = "⬛";
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
        row.includes(green) ||
        row.includes(yellow) ||
        row.includes(blank) ||
        row.includes(blankDark)
    );
};

export const SolveForm: FC<SolveFormProps> = ({
  onSubmit,
  solveTextFromUrl,
  cachedName,
}) => {
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const solve = (form.elements.namedItem("solve") as HTMLTextAreaElement)
      .value;
    const solveRows = extractSolveRowStrings(solve).map(parseRow);
    if (
      solveRows.length < 1 ||
      solveRows.length > 6 ||
      solveRows.some((row) => row.length !== 5)
    ) {
      setError("Invalid solve format");
      return;
    }
    if (
      solveRows.some(
        (row, index) =>
          row.every((cell) => cell === "G") && index !== solveRows.length - 1
      )
    ) {
      setError("No guesses allowed after a full solve row");
      return;
    }
    onSubmit(name, solveRows);
    form.reset();
  };
  return (
    <form className="solve-form" onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      <label>
        Name:
        <input type="text" name="name" defaultValue={cachedName ?? undefined} />
      </label>
      <label>
        Solve:
        <textarea name="solve" defaultValue={solveTextFromUrl ?? undefined} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};
