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
  const { content, important } = req.body;

  if (!content) {
    return res.status(400).send("content missing");
  }

  Note.findOne({ content }).then((existingNote) => {
    if (existingNote) {
      return res.status(400).send("content already exists");
    }

    const note = new Note({
      content,
      important: important || false,
    });

    note.save().then((savedNote) => res.status(201).json(savedNote));
  });
});

app.delete("/api/notes/:id", (req, res) => {
  Note.findByIdAndDelete(req.params.id)
    .then((deletedNote) => (deletedNote ? res.sendStatus(204) : res.status(404).send("note not found")))
    .catch(() => res.status(404).send("note not found"));
});

app.put("api/notes/:id", (req, res) => {
  const id = req.params.id;
  const { content, important } = req.body;

  Note.findByIdAndUpdate(id, { content, important }, { new: true, runValidators: true }).then((updatedNote) =>
    console.log(updatedNote),
  );
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
