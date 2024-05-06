import express from "express";
import cors from "cors";
import { SqlitePuzzleDao } from "./data/sqliteDao";
import { Solve } from "./data/interface";
import { MssqlPuzzleDao } from "./data/mssqlDao";

export const app = express();
app.use(express.json());
app.use(cors());
const puzzleDao = new MssqlPuzzleDao();

export const init = async () => {
  await puzzleDao.init();
  app.get("/puzzle", async (req, res) => {
    const date = new Date(req.query.date as string);
    const puzzleId = await puzzleDao.getPuzzle(date);
    res.json(puzzleId);
  });

  app.get("/solves/:puzzleId", async (req, res) => {
    const puzzleId = parseInt(req.params.puzzleId);
    const solves = await puzzleDao.getSolves(puzzleId);
    res.json(solves);
  });

  app.post("/solves/:puzzleId", async (req, res) => {
    const puzzleId = parseInt(req.params.puzzleId);
    const newSolve: Omit<Solve, "id" | "puzzleId"> = req.body;
    const addedSolve = await puzzleDao.createSolve(puzzleId, newSolve);
    res.json(addedSolve);
  });
};

export const clearSolves = async () => {
  await puzzleDao.clearSolves();
};
