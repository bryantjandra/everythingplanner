import express from "express";
import bcrypt from "bcrypt";
import { pool } from "./db";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./middleware/auth";
import { config } from "./config";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/health", (req, res) => {
  return res.json({ status: "ok" });
});

app.get("/db-check", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  return res.json({ now: result.rows[0].now });
});

app.post("/auth/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (typeof username !== "string" || username === "") {
    return res.status(400).json({ error: "username is required" });
  }
  if (typeof email !== "string" || email === "") {
    return res.status(400).json({ error: "email is required" });
  }
  if (typeof password !== "string" || password === "") {
    return res.status(400).json({ error: "password is required" });
  }

  const hash = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id",
      [username, email, hash],
    );
    const userId = result.rows[0].id;
    const token = jwt.sign({ userId: userId }, config.jwtSecret, {
      expiresIn: "7d",
    });
    return res.json({ token: token });
  } catch (err: any) {
    if (err.code === "23505") {
      return res
        .status(409)
        .json({ error: "username or email already in use" });
    }
    throw err;
  }
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (typeof email !== "string" || email === "") {
    return res.status(400).json({ error: "email is required" });
  }
  if (typeof password !== "string" || password === "") {
    return res.status(400).json({ error: "password is required" });
  }

  const result = await pool.query(
    "SELECT id, password_hash FROM users WHERE email = $1",
    [email],
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ error: "invalid credentials" });
  }
  const isValidPassword = await bcrypt.compare(
    password,
    result.rows[0].password_hash,
  );

  if (!isValidPassword) {
    return res.status(401).json({ error: "invalid credentials" });
  }

  const token = jwt.sign({ userId: result.rows[0].id }, config.jwtSecret, {
    expiresIn: "7d",
  });

  return res.json({ token: token });
});

app.get("/sessions", authMiddleware, async (req, res) => {
  const date = req.query.date;
  if (typeof date !== "string") {
    return res.status(400).json({ error: "date query param required" });
  }
  const result = await pool.query(
    "SELECT count FROM sessions WHERE user_id = $1 AND date = $2",
    [req.userId, date],
  );
  const count = result.rows[0]?.count ?? 0;

  return res.json({ count: count });
});

app.post("/sessions", authMiddleware, async (req, res) => {
  const { date, count } = req.body;

  if (typeof date !== "string") {
    return res.status(400).json({ error: "date must be a string" });
  }

  if (typeof count !== "number") {
    return res.status(400).json({ error: "count must be a number" });
  }

  await pool.query(
    "INSERT INTO sessions (user_id, date, count) VALUES ($1, $2, $3) ON CONFLICT (user_id, date) DO UPDATE SET count = EXCLUDED.count",
    [req.userId, date, count],
  );

  return res.json({ ok: true });
});

app.get("/todos", authMiddleware, async (req, res) => {
  const date = req.query.date;
  if (typeof date !== "string") {
    return res.status(400).json({ error: "date query param required" });
  }
  const result = await pool.query(
    "SELECT text, completed FROM todos WHERE user_id = $1 AND date = $2 ORDER BY id",
    [req.userId, date],
  );

  return res.json({ todos: result.rows });
});

app.post("/todos", authMiddleware, async (req, res) => {
  const { date, todos } = req.body;
  if (typeof date !== "string") {
    return res.status(400).json({ error: "date must be a string" });
  }

  if (!Array.isArray(todos)) {
    return res.status(400).json({ error: "todos must be an array" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM todos WHERE user_id = $1 AND date = $2", [
      req.userId,
      date,
    ]);
    for (const todo of todos) {
      await client.query(
        "INSERT INTO todos (user_id, text, completed, date) VALUES ($1, $2, $3, $4)",
        [req.userId, todo.text, todo.completed, date],
      );
    }
    await client.query("COMMIT");
    return res.json({ ok: true });
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
});

app.get("/goals", authMiddleware, async (req, res) => {
  const yearStr = req.query.year;
  if (typeof yearStr !== "string") {
    return res.status(400).json({ error: "year query param required" });
  }
  const year = Number(yearStr);
  if (!Number.isInteger(year)) {
    return res.status(400).json({ error: "year must be an integer" });
  }

  // fetch all goals for the year
  const goalsResult = await pool.query(
    "SELECT id, title, category, progress, year FROM goals WHERE user_id = $1 AND year = $2",
    [req.userId, year],
  );

  const goals = goalsResult.rows;
  if (goals.length === 0) {
    return res.json({ goals: [] });
  }

  // fetch all subgoals for each respective goal id
  const goalIds = goals.map((g) => {
    return g.id;
  });

  const subgoalsResult = await pool.query(
    "SELECT id, goal_id, title, done FROM subgoals WHERE goal_id = ANY ($1) ORDER BY id",
    [goalIds],
  );

  // group subgoals by their goal_id and attach them
  const subgoalsByGoalId = new Map<number, any[]>();
  for (const sg of subgoalsResult.rows) {
    if (!subgoalsByGoalId.has(sg.goal_id)) {
      subgoalsByGoalId.set(sg.goal_id, []);
    }
    subgoalsByGoalId.get(sg.goal_id)?.push({
      id: sg.id,
      title: sg.title,
      done: sg.done,
    });
  }
  const goalsWithSubgoals = goals.map((g) => {
    return {
      ...g,
      subgoals: subgoalsByGoalId.get(g.id) ?? [],
    };
  });

  return res.json({ goals: goalsWithSubgoals });
});

app.post("/goals", authMiddleware, async (req, res) => {
  const { year, goals } = req.body;
  if (!Number.isInteger(year)) {
    return res.status(400).json({ error: "year must be an integer" });
  }

  if (!Array.isArray(goals)) {
    return res.status(400).json({ error: "goals must be an array" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM goals WHERE user_id = $1 AND year = $2", [
      req.userId,
      year,
    ]);

    // for each new goal, insert it. Then insert its subgoals
    for (const goal of goals) {
      const insertedGoalResult = await client.query(
        "INSERT INTO goals (user_id, title, category, progress, year) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        [req.userId, goal.title, goal.category, goal.progress, year],
      );
      const newGoalId = insertedGoalResult.rows[0].id;

      for (const sg of goal.subgoals ?? []) {
        await client.query(
          "INSERT INTO subgoals (goal_id, title, done) VALUES ($1, $2, $3)",
          [newGoalId, sg.title, sg.done],
        );
      }
    }
    await client.query("COMMIT");
    return res.json({ ok: true });
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on PORT:${PORT}`);
});
