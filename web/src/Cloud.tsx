import { FC } from "react";
import { Solve, SolveRowItem } from "./data/interface";

import "./Cloud.css";

export type CloudProps = {
  solves: Solve[];
};

export const Cloud: FC<CloudProps> = ({ solves }) => {
  const tableRows: SolveRowItem[][][] = [];
  const rowCounts = [0, 0, 0, 0, 0, 0];
  for (let i = 0; i < 6; i++) {
    tableRows[i] = [];
    rowCounts[i] = solves.filter((solve) => solve.solveRows[i]).length;
    for (let j = 0; j < 5; j++) {
      tableRows[i][j] = [];
      for (let solve of solves) {
        tableRows[i][j].push(solve.solveRows[i]?.[j]);
      }
    }
  }
  return (
    <table className="cloud">
      <tbody>
        {tableRows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <SquareCell
                key={j}
                items={cell}
                totalSolves={solves.length}
                rowSolves={rowCounts[i]}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

type Point = {
  hue: number;
  lightness: number;
};
const setPoints: Point[] = [
  {
    hue: 60,
    lightness: 100,
  },
  {
    hue: 60,
    lightness: 59,
  },
  {
    hue: 90,
    lightness: 41,
  },
];
const bins = setPoints.length - 1;
const binDivisor = 2 / bins;

const colorForCell = (
  items: SolveRowItem[],
  totalSolves: number,
  rowSolves: number
): string => {
  if (items.length === 0) {
    return "white";
  }

  const alpha = rowSolves / totalSolves;

  const cellTotal = (
    items.map((item) => (item === "G" ? 2 : item === "Y" ? 1 : 0)) as number[]
  ).reduce((a, b) => a + b, 0);
  const cellMean = cellTotal / items.length;

  const bin = Math.floor(cellMean / binDivisor);
  const point1 = setPoints[bin];
  const point2 = setPoints[bin + 1] ?? point1;
  const t = (cellMean - bin * binDivisor) / binDivisor;
  const hue = interpolate(point1.hue, point2.hue, t);
  const lightness = interpolate(point1.lightness, point2.lightness, t);
  return `hsla(${hue}, 100%, ${lightness}%, ${alpha})`;
};

const interpolate = (a: number, b: number, t: number) => {
  return a + (b - a) * t;
};

const SquareCell: FC<{
  items: SolveRowItem[];
  totalSolves: number;
  rowSolves: number;
}> = ({ items, rowSolves, totalSolves }) => {
  const backgroundColor = colorForCell(items, rowSolves, totalSolves);
  console.log(items, backgroundColor);
  const contents = items.map((item) => item || "").join("");
  return <td style={{ backgroundColor: backgroundColor }}>{contents}</td>;
};
