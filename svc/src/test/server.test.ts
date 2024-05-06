import request from "supertest";
import { app, init } from "../app";
import fs from "fs";

describe("e2e tests", () => {
  const dbPath = process.env.WORDLE_DB_PATH;
  if (!dbPath) {
    throw new Error("WORDLE_DB_PATH not set");
  }
  beforeAll(async () => {
    // delete sqlite db file before running tests
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }

    await init();
  });

  describe("GET /puzzles", () => {
    it("should return the seed puzzle", async () => {
      const response = await request(app).get("/puzzle?date=2024-04-12");
      expect(response.statusCode).toBe(200);
      expect(response.body).toBe(1028);
    });

    it("should return the following day's puzzle", async () => {
      const response = await request(app).get("/puzzle?date=2024-04-13");
      expect(response.statusCode).toBe(200);
      expect(response.body).toBe(1029);
    });
  });

  describe("solves endpoints", () => {
    it("should initially return an empty array", async () => {
      const response = await request(app).get("/solves/1028");
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([]);
    });

    it("should allow adding a solve", async () => {
      const newSolve = {
        name: "test",
        solveRows: [
          ["Y", "Y", "Y", "Y", "Y"],
          ["G", "G", "G", "G", "G"],
        ],
      };
      const response = await request(app).post("/solves/1028").send(newSolve);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        puzzleId: 1028,
        name: "test",
        solveRows: [
          ["Y", "Y", "Y", "Y", "Y"],
          ["G", "G", "G", "G", "G"],
        ],
      });
    });

    it("should return the added solve", async () => {
      const response = await request(app).get("/solves/1028");
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([
        {
          id: 1,
          puzzleId: 1028,
          name: "test",
          solveRows: [
            ["Y", "Y", "Y", "Y", "Y"],
            ["G", "G", "G", "G", "G"],
          ],
        },
      ]);
    });

    it("should allow adding a second solve", async () => {
      const newSolve = {
        name: "test2",
        solveRows: [
          ["Y", "Y", "Y", "Y", "Y"],
          ["G", "G", "G", "G", "G"],
        ],
      };
      const response = await request(app).post("/solves/1028").send(newSolve);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 2,
        puzzleId: 1028,
        name: "test2",
        solveRows: [
          ["Y", "Y", "Y", "Y", "Y"],
          ["G", "G", "G", "G", "G"],
        ],
      });
    });

    it("should return both solves", async () => {
      const response = await request(app).get("/solves/1028");
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([
        {
          id: 1,
          puzzleId: 1028,
          name: "test",
          solveRows: [
            ["Y", "Y", "Y", "Y", "Y"],
            ["G", "G", "G", "G", "G"],
          ],
        },
        {
          id: 2,
          puzzleId: 1028,
          name: "test2",
          solveRows: [
            ["Y", "Y", "Y", "Y", "Y"],
            ["G", "G", "G", "G", "G"],
          ],
        },
      ]);
    });

    it("should not return the solves for a different puzzle", async () => {
      const response = await request(app).get("/solves/1029");
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([]);
    });
  });
});
