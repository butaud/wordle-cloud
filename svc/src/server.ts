import express from "express";
import { SqlitePuzzleDao } from "./data/sqliteDao";
import { Solve } from "./data/interface";

const app = express();
app.use(express.json());

(async () => {
  const sqliteDao = new SqlitePuzzleDao("./bin/prod.db");
  await sqliteDao.init();

  app.get("/todayPuzzle", async (req, res) => {
    const today = new Date();
    const puzzleId = await sqliteDao.getPuzzle(today);
    res.json({ puzzleId });
  });

  app.get("/solves/:puzzleId", async (req, res) => {
    const puzzleId = parseInt(req.params.puzzleId);
    const solves = await sqliteDao.getSolves(puzzleId);
    res.json(solves);
  });

  app.post("/solves/:puzzleId", async (req, res) => {
    const puzzleId = parseInt(req.params.puzzleId);
    const newSolve: Omit<Solve, "id" | "puzzleId"> = req.body;
    const addedSolve = await sqliteDao.createSolve(puzzleId, newSolve);
    res.json(addedSolve);
  });

  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
})();
