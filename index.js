const config = require('./utils/config');
const express = require('express');
const Note = require('./models/note');

const app = express();

app.use(express.json());

app.get('/', (_, res) => {
  res.send('<h1>Hello World!</h1>');
});

app.get('/api/notes', (_, res) => {
  Note.find({}).then((notes) => res.json(notes));
});

app.get('/api/notes/:id', (req, res, next) => {
  Note.findById(req.params.id)
    .then((note) => {
      if (note) return res.json(note);

      res.status(404).send('note not found');
    })
    .catch((err) => next(err));
});

app.post('/api/notes', (req, res, next) => {
  const { content, important } = req.body;

  if (!content) return res.status(400).send('content missing');

  Note.findOne({ content })
    .collation({ locale: 'en', strength: 2 })
    .then((note) => {
      if (note) return res.status(400).send('content already exists');

      const newNote = new Note({ content, important: important || false });

      return newNote.save();
    })
    .then((savedNote) => res.status(201).json(savedNote))
    .catch((err) => next(err));
});

app.delete('/api/notes/:id', (req, res, next) => {
  Note.findByIdAndDelete(req.params.id)
    .then((deletedNote) => (deletedNote ? res.sendStatus(204) : res.status(404).send('note not found')))
    .catch((err) => next(err));
});

app.put('/api/notes/:id', (req, res, next) => {
  const { content, important } = req.body;

  Note.findById(req.params.id)
    .then((note) => {
      if (!note) return res.status(404).send('note not found');

      note.content = content;
      note.important = important;

      note.save().then((updatedNote) => res.json(updatedNote));
    })
    .catch((err) => next(err));
});

app.use((req, res) => {
  res.status(404).send(`cannot ${req.method} ${req.originalUrl}`);
});
app.use((err, _, res, __) => {
  switch (err.name) {
    case 'CastError':
      res.status(400).send('malformatted id');
      break;
    case 'ValidationError':
      res.status(400).send(err.errors.content.message);
      break;
  }
});

app.listen(PORT, () => {
  console.log(`server running on port ${config.PORT}`);
});
