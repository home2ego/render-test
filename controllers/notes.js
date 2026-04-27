const notesRouter = require('express').Router();
const Note = require('../models/note');

notesRouter.get('/', async (_req, res) => {
  const notes = await Note.find({});
  res.json(notes);
});

notesRouter.get('/:id', async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (note) return res.json(note);

  res.status(404).send('note not found');
});

notesRouter.post('/', async (req, res) => {
  const { content, important } = req.body;

  if (!content) return res.status(400).send('content missing');

  const existingNote = await Note.findOne({ content }).collation({ locale: 'en', strength: 2 });

  if (existingNote) return res.status(400).send('content already exists');

  const newNote = new Note({ content, important: important || false });

  const savedNote = await newNote.save();

  res.status(201).json(savedNote);
});

notesRouter.delete('/:id', async (req, res) => {
  const deletedNote = await Note.findByIdAndDelete(req.params.id);

  if (deletedNote) return res.sendStatus(204);

  res.status(404).send('note not found');
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
