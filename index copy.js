const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('ONLY FOR TEST PURPOSE! (Stag)')
})


// Get all todos
app.get("/todos", async (req, res) => {
  const todos = await db("todos").select("*");
  res.json(todos);
});

// Add new todo
app.post("/todos", async (req, res) => {
  const { title } = req.body;
  await db("todos").insert({ title });
  res.json({ message: "Todo added" });
});

// Update todo (toggle completed or edit title)
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  await db("todos").where({ id }).update({ title, completed });
  res.json({ message: "Todo updated" });
});

// Delete todo
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  await db("todos").where({ id }).del();
  res.json({ message: "Todo deleted" });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
