import "./App.css";
import { PuzzleClient } from "./data/puzzleClient";
import { Solve, SolveRow } from "./data/interface";
import { SolveForm } from "./SolveForm";
import { Cloud } from "./Cloud";
import { usePuzzleData } from "./hooks/use-puzzle-data";

const puzzleClient = new PuzzleClient("http://localhost:3001");

function App() {
  const puzzleIdFromUrlStr = new URLSearchParams(window.location.search).get(
    "puzzleId"
  );
  const puzzleIdFromUrl = puzzleIdFromUrlStr
    ? parseInt(puzzleIdFromUrlStr)
    : null;

  const { puzzleId, isToday, solves, addSolve } = usePuzzleData(
    puzzleClient,
    puzzleIdFromUrl
  );

  const onSolveFormSubmit = (name: string, rows: SolveRow[]) => {
    if (puzzleId === null || solves === null) {
      return;
    }
    const solve: Omit<Solve, "id"> = {
      puzzleId,
      name,
      solveRows: rows,
    };
    addSolve(solve);
  };

  return (
    <div className="App">
      <h1>Puzzle: {puzzleId || "Loading..."}</h1>
      <div className="nav">
        {puzzleId !== null && puzzleId !== 1 && (
          <a href={`?puzzleId=${puzzleId - 1}`}>{`<< ${puzzleId - 1}`}</a>
        )}
        {puzzleId !== null && !isToday && (
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
