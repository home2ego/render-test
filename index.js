require("dotenv").config();
const express = require("express");
const Note = require("./models/note");

const app = express();

app.use(express.json());

app.get("/", (_, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (_, response) => {
  Note.find({}).then((notes) => response.json(notes));
});

app.get("/api/notes/:id", (request, response) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        return response.json(note);
      }

      response.status(404).send("note not found");
    })
    .catch(() => response.status(404).send("note not found"));
});

app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).send("content missing");
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note.save().then((savedNote) => response.json(savedNote));
});

app.delete("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
