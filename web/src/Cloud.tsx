import { FC } from "react";
import { Solve, SolveRowItem } from "./data/interface";

import "./Cloud.css";
import { Solver } from "./Solver";

export type CloudProps = {
  solves: Solve[];
};

type SolverCellEntry = {
  name: string;
  item: SolveRowItem;
};

type DisplayCell = {
  entries: SolverCellEntry[];
};

type DisplayRow = {
  cells: DisplayCell[];
  solvers: string[];
};

type DisplayTable = DisplayRow[];

const displayTableFromSolves = (solves: Solve[]): DisplayTable => {
  const table: DisplayTable = [];
  for (let i = 0; i < 6; i++) {
    const cells: DisplayCell[] = [];
    const solvers = new Set<string>();
    for (let j = 0; j < 5; j++) {
      const cell: DisplayCell = { entries: [] };
      for (let solve of solves) {
        if (solve.solveRows[i]) {
          if (solve.solveRows[i].every((item) => item === "G")) {
            solvers.add(solve.name);
          }
          const item = solve.solveRows[i][j];
          if (item !== undefined) {
            cell.entries.push({ name: solve.name, item });
          }
        }
      }
      cells.push(cell);
    }
    table.push({ cells, solvers: Array.from(solvers) });
  }
  return table;
};

export const Cloud: FC<CloudProps> = ({ solves }) => {
  const displayTable = displayTableFromSolves(solves);
  return (
    <div className="cloud">
      {displayTable.map((row, i) => (
        <>
          {row.cells.map((cell, j) => (
            <SquareCell key={j} cell={cell} totalSolves={solves.length} />
          ))}
          <div className="names">
            {row.solvers.map((solver) => (
              <Solver
                key={solver}
                name={solver}
                size={row.solvers.length <= 3 ? "regular" : "small"}
              />
            ))}
          </div>
        </>
      ))}
    </div>
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

const colorForCell = (items: SolveRowItem[], totalSolves: number): string => {
  if (items.length === 0) {
    return "white";
  }

  const alpha = items.filter((item) => item !== "").length / totalSolves;

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
  cell: DisplayCell;
  totalSolves: number;
}> = ({ cell, totalSolves }) => {
  const backgroundColor = colorForCell(
    cell.entries.map((entry) => entry.item),
    totalSolves
  );
  const contentfulEntries = cell.entries.filter((entry) => entry.item !== "");
  return (
    <div className="cell" style={{ backgroundColor: backgroundColor }}>
      {contentfulEntries.map((entry) => (
        <Solver
          key={entry.name}
          name={entry.name}
          cellItem={entry.item}
          size={contentfulEntries.length > 6 ? "tiny" : "small"}
        />
      ))}
    </div>
  );
};
