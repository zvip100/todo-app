import express from "express";
import cors from "cors";
import pgPromise from "pg-promise";

const pgp = pgPromise();
const db = pgp({
  host: "ep-white-field-a6m3jd5i.us-west-2.retooldb.com",
  port: 5432,
  database: "retool",
  user: "retool",
  password: "tLk94ITwGvMR",
  ssl: true,
});

const app = express();
app.use(cors());
app.use(express.json());

app.post("/sign-up", async (req, res) => {
  const result = await db.one(
    'insert into public.person ("name", pass) values (${userName}, ${password}) returning *',
    {
      userName: req.body.userName,
      password: req.body.password,
    }
  );
  console.log("result", result);
  res.json({
    userName: result.userName,
    password: result.password,
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
    console.log("result", result);
    if (!result) {
      res.json({ ok: false });
    }

    res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
});

app.post("/tasks", async (req, res) => {
  const result = await db.one(
    "insert into public.task (title, user_id) values (${title}, ${user_id}) returning *",
    {
      title: req.body.title,
      user_id: 1,
    }
  );
  console.log("result", result);
  res.json({
    title: result.title,
    done: false,
    id: result.id,
  });
});

app.get("/tasks", async (req, res) => {
  const result = await db.many(
    "select * from public.task where deleted_at is null"
  );
  res.json(
    result.map((task) => ({
      id: task.id,
      title: task.title,
      done: task.status !== "active",
    }))
  );
});

app.patch("/tasks/:id", async (req, res) => {
  const result = await db.none(
    "update public.task set status = 'done' where id = ${id}",
    {
      id: req.params.id,
    }
  );
  res.json({ ok: true });
});

app.delete("/tasks/:id", async (req, res) => {
  await db.none("update public.task set deleted_at = now() where id = ${id}", {
    id: req.params.id,
  });
  res.json({ ok: true });
});

app.listen("3000", () => {
  console.log("the server is now running and listening for requests");
});
