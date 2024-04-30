import { useState, useEffect } from "react";
import { Solve } from "../data/interface";
import { PuzzleClient } from "../data/puzzleClient";

type PuzzleData = {
  puzzleId: number | null;
  isToday: boolean;
  solves: Solve[] | null;
  addSolve: (solve: Omit<Solve, "id">) => void;
};

export const usePuzzleData = (
  puzzleClient: PuzzleClient,
  puzzleIdFromUrl: number | null
): PuzzleData => {
  const [todayPuzzleId, setTodayPuzzleId] = useState<number | null>(null);
  const [solves, setSolves] = useState<Solve[] | null>(null);

  useEffect(() => {
    (async () => {
      const date = new Date();
      const todayPuzzleId = await puzzleClient.getPuzzle(date);
      setTodayPuzzleId(todayPuzzleId);
      const solves = await puzzleClient.getSolves(
        puzzleIdFromUrl || todayPuzzleId
      );
      setSolves(solves);
    })();
  }, [puzzleClient, puzzleIdFromUrl]);

  const puzzleId =
    todayPuzzleId === null ? null : puzzleIdFromUrl || todayPuzzleId;

  const addSolve = (solve: Omit<Solve, "id">) => {
    if (puzzleId === null || solves === null) {
      return;
    }

    puzzleClient.createSolve(puzzleId, solve).then((newSolve) => {
      setSolves([...solves, newSolve]);
    });
  };
  const isToday = puzzleId === todayPuzzleId;
  return { puzzleId, isToday, solves, addSolve };
};
