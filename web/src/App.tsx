import { useEffect, useState } from "react";
import "./App.css";
import { PuzzleClient } from "./data/puzzleClient";
import { Solve, SolveRow } from "./data/interface";
import { SolveForm } from "./SolveForm";
import { Cloud } from "./Cloud";

const puzzleClient = new PuzzleClient(
  "https://wordle-cloud-svc-2.azurewebsites.net"
);
const date = new Date();

function App() {
  const puzzleIdFromUrlStr = new URLSearchParams(window.location.search).get(
    "puzzleId"
  );
  const puzzleIdFromUrl = puzzleIdFromUrlStr
    ? parseInt(puzzleIdFromUrlStr)
    : null;
  const [todayPuzzleId, setTodayPuzzleId] = useState<number | null>(null);
  const [solves, setSolves] = useState<Solve[] | null>(null);
  useEffect(() => {
    (async () => {
      const todayPuzzleId = await puzzleClient.getPuzzle(date);
      setTodayPuzzleId(todayPuzzleId);
      const solves = await puzzleClient.getSolves(
        puzzleIdFromUrl || todayPuzzleId
      );
      setSolves(solves);
    })();
  }, [puzzleIdFromUrl]);

  const puzzleId = puzzleIdFromUrl || todayPuzzleId;

  const onSolveFormSubmit = (name: string, rows: SolveRow[]) => {
    if (puzzleId === null || solves === null) {
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
  const puzzleIdLoading = puzzleId === null || todayPuzzleId === null;

  return (
    <div className="App">
      <h1>Puzzle: {puzzleId || "Loading..."}</h1>
      <div className="nav">
        {!puzzleIdLoading && puzzleId !== 1 && (
          <a href={`?puzzleId=${puzzleId - 1}`}>{`<< ${puzzleId - 1}`}</a>
        )}
        {!puzzleIdLoading && puzzleId !== todayPuzzleId && (
          <>
            <a href={"."}>{`Today`}</a>
            <a href={`?puzzleId=${puzzleId + 1}`}>{`${puzzleId + 1} >>`}</a>
          </>
        )}
      </div>
      <div className="content">
        <section>
          <h2>Add Your Solve</h2>
          <SolveForm onSubmit={onSolveFormSubmit} />
        </section>
        <section>
          <h2>Solves</h2>
          <Cloud solves={solves} />
        </section>
      </div>
    </div>
  );
}

export default App;
