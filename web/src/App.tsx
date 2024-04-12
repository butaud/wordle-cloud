import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { PuzzleClient } from "./data/puzzleClient";

function App() {
  const puzzleClient = new PuzzleClient("http://localhost:3001");
  puzzleClient.getPuzzle(new Date()).then((puzzleId) => {
    console.log("puzzleId", puzzleId);
  });
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
