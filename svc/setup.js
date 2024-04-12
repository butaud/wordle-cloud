const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./bin/my_database.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the my_database database.");
});

db.serialize(() => {
  // create the puzzles table
  db.run("CREATE TABLE puzzles (id INTEGER PRIMARY KEY, date TEXT NOT NULL)");

  // insert a seed puzzle
  db.run("INSERT INTO puzzles (id, date) VALUES (1028, '2024-04-12')");

  // create the solves table
  db.run(
    "CREATE TABLE solves (id INTEGER PRIMARY KEY, puzzle_id INTEGER NOT NULL, name TEXT NOT NULL)"
  );

  // create the solve_rows table
  db.run(
    "CREATE TABLE solve_rows (id INTEGER PRIMARY KEY, solve_id INTEGER NOT NULL, row TEXT NOT NULL)"
  );
});

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Close the database connection.");
});
