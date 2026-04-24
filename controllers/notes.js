const notesRouter = require('express').Router();
const Note = require('../models/note');

notesRouter.get('/', (_req, res) => {
  Note.find({}).then((notes) => res.json(notes));
});

notesRouter.get('/:id', (req, res, next) => {
  Note.findById(req.params.id)
    .then((note) => {
      if (note) return res.json(note);

      res.status(404).send('note not found');
    })
    .catch((err) => next(err));
});

notesRouter.post('/', (req, res, next) => {
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

notesRouter.delete('/:id', (req, res, next) => {
  Note.findByIdAndDelete(req.params.id)
    .then((deletedNote) => (deletedNote ? res.sendStatus(204) : res.status(404).send('note not found')))
    .catch((err) => next(err));
});

notesRouter.put('/:id', (req, res, next) => {
  const { content, important } = req.body;

  Note.findById(req.params.id)
    .then((note) => {
      if (!note) return res.status(404).send('note not found');

      note.content = content;
      note.important = important;

      return note.save();
    })
    .then((updatedNote) => res.json(updatedNote))
    .catch((err) => next(err));
});

module.exports = notesRouter;
