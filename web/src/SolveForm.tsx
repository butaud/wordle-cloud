import { FC } from "react";
import { SolveRow } from "./data/interface";

type SolveFormProps = {
  onSubmit: (name: string, solveRows: SolveRow[]) => void;
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
        const solveRows = solve
          .split("\n")
          .map((row) => row.trim().split(" ") as SolveRow);
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
