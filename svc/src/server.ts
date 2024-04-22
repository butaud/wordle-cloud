import express from "express";
import cors from "cors";
import { SqlitePuzzleDao } from "./data/sqliteDao";
import { Solve } from "./data/interface";
import path from "path";

const app = express();
app.use(express.json());
app.use(cors());

(async () => {
  const dbPath = path.resolve(__dirname, "./prod.db");
  const sqliteDao = new SqlitePuzzleDao(dbPath);
  await sqliteDao.init();
  app.get("/puzzle", async (req, res) => {
    const date = new Date(req.query.date as string);
    const puzzleId = await sqliteDao.getPuzzle(date);
    res.json(puzzleId);
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

  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})();
