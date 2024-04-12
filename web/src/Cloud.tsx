import { FC } from "react";
import { Solve } from "./data/interface";

import "./Cloud.css";

export type CloudProps = {
  solves: Solve[];
};

export const Cloud: FC<CloudProps> = ({ solves }) => {
  const tableRows: string[][] = [];
  for (let i = 0; i < 6; i++) {
    tableRows[i] = [];
    for (let j = 0; j < 5; j++) {
      tableRows[i][j] = "";
      for (let solve of solves) {
        tableRows[i][j] += solve.solveRows[i]?.[j] ?? "";
      }
    }
  }
  return (
    <table className="cloud">
      <tbody>
        {tableRows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
