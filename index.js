require("dotenv").config();
const express = require("express");
const Note = require("./models/note");

const app = express();

app.use(express.json());

app.get("/", (_, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (_, res) => {
  Note.find({}).then((notes) => res.json(notes));
});

app.get("/api/notes/:id", (req, res) => {
  Note.findById(req.params.id)
    .then((note) => {
      if (note) {
        return res.json(note);
      }

      res.status(404).send("note not found");
    })
    .catch(() => res.status(404).send("note not found"));
});

app.post("/api/notes", (req, res) => {
  const body = req.body;

  if (!body.content) {
    return res.status(400).send("content missing");
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note.save().then((savedNote) => res.json(savedNote));
});

app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  notes = notes.filter((note) => note.id !== id);

  res.status(204).end();
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
