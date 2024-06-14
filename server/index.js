import express from "express";
import cors from "cors";
import pgPromise from "pg-promise";
import dbPswd from "./db-pswd.js";
import { configDotenv } from "dotenv";

//const dbpass = dbPswd;
const pgp = pgPromise();

const env = configDotenv();
console.log(env);

const db = pgp({
  host: "ep-white-field-a6m3jd5i.us-west-2.retooldb.com",
  port: 5432,
  database: "retool",
  user: "retool",
  //password: dbpass,
  password: process.env.DB_PSWD,
  ssl: true,
});

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;
//const PORT = "3000";

app.post("/sign-up", async (req, res) => {
  const result = await db.one(
    'insert into public.person ("name", pass) values (${userName}, ${password}) returning *',
    {
      userName: req.body.userName,
      password: req.body.password,
    }
  );
  console.log("sign-up post result", result);

  res.json({
    userId: result.id,
    userName: result.name,
    password: result.pass,
  });
});

app.post("/login", async (req, res) => {
  try {
    const result = await db.oneOrNone(
      'select * from public.person where "name" = (${userName}) and pass = (${password})',
      {
        userName: req.body.userName,
        password: req.body.password,
      }
    );
    console.log("login post result", result);
    if (!result) {
      res.json({ ok: false });
      return;
    }

    res.json({ ok: true, userId: result.id });
  } catch (err) {
    console.log(err);
  }
});

app.get("/tasks/:userId", async (req, res) => {
  try {
    const result = await db.any(
      "select * from public.task where user_id = ${userId} and deleted_at is null",
      {
        userId: req.params.userId,
      }
    );

    console.log("tasks get result", result);
    res.json(
      result.map((task) => ({
        id: task.id,
        userId: task.user_id,
        title: task.title,
        done: task.status !== "active",
      }))
    );
  } catch (err) {
    console.log(err);
  }
});

app.post("/tasks", async (req, res) => {
  const result = await db.one(
    "insert into public.task (title, user_id) values (${title}, ${user_id}) returning *",
    {
      title: req.body.title,
      user_id: req.body.userId,
    }
  );

  console.log("tasks post result", result);
  res.json({
    id: result.id,
    userId: result.user_id,
    title: result.title,
    done: false,
  });
});

app.patch("/tasks/:id", async (req, res) => {
  try {
    const result = await db.oneOrNone(
      "update public.task set status = 'done' where id = ${id} and user_id = ${userId} returning *",
      {
        id: req.params.id,
        userId: req.body.userId,
      }
    );
    console.log("patch result: ", result);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const result = await db.oneOrNone(
      "update public.task set deleted_at = now() where id = ${id} and user_id = ${userId} returning *",
      {
        id: req.params.id,
        userId: req.body.userId,
      }
    );
    console.log("delete result: ", result);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
});

app.listen(PORT, () => {
  console.log(
    `the server is now running and listening for requests at http://localhost:${PORT}`
  );
});
