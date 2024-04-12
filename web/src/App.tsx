import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { PuzzleClient } from "./data/puzzleClient";
import { Solve, SolveRow } from "./data/interface";
import { SolveForm } from "./SolveForm";

const puzzleClient = new PuzzleClient("http://localhost:3001");
const date = new Date();

function App() {
  const [puzzleId, setPuzzleId] = React.useState<number | null>(null);
  const [solves, setSolves] = React.useState<Solve[]>([]);
  React.useEffect(() => {
    puzzleClient.getPuzzle(date).then((puzzleId) => {
      setPuzzleId(puzzleId);
      puzzleClient.getSolves(puzzleId).then((solves) => {
        setSolves(solves);
      });
    });
  }, []);

  const onSolveFormSubmit = (name: string, rows: SolveRow[]) => {
    if (puzzleId === null) {
      return;
    }
    const solve: Omit<Solve, "id"> = {
      puzzleId,
      name,
      solveRows: rows,
    };
    puzzleClient.createSolve(puzzleId, solve).then((newSolve) => {
      setSolves([...solves, newSolve]);
    });
  };

  return (
    <div className="App">
      <h1>Puzzle: {puzzleId}</h1>
      <h2>Solves</h2>
      <ul>
        {solves.map((solve) => (
          <li key={solve.id}>
            {solve.name}
            <ul>
              {solve.solveRows.map((row, i) => (
                <li key={i}>{row.join(" ")}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <h2>Add Your Solve</h2>
      <SolveForm onSubmit={onSolveFormSubmit} />
    </div>
  );
}

export default App;
