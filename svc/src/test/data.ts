import { Solve } from "../data/interface";
import { SqlitePuzzleDao } from "../data/sqliteDao";

(async () => {
  const sqliteDao = new SqlitePuzzleDao("./bin/test.db");
  await sqliteDao.init();
  sqliteDao.clearSolves();
  const today = new Date();
  console.log("today is", today);
  const puzzleId = await sqliteDao.getPuzzle(today);

  console.log("today's puzzle id is", puzzleId);

  // test tomorrow's puzzle
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowPuzzleId = await sqliteDao.getPuzzle(tomorrow);
  console.log("tomorrow's puzzle id is", tomorrowPuzzleId);

  const solves = await sqliteDao.getSolves(puzzleId);
  console.log("solves", solves);

  const newSolve: Omit<Solve, "id" | "puzzleId"> = {
    name: "test",
    solveRows: [
      ["G", "G", "G", "G", "G"],
      ["Y", "Y", "Y", "Y", "Y"],
    ],
  };

  const createdSolve = await sqliteDao.createSolve(puzzleId, newSolve);

  console.log("created solve", createdSolve);

  const solvesAfterCreate = await sqliteDao.getSolves(puzzleId);
  console.log("solves after create", solvesAfterCreate);
})();
