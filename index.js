const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

morgan.token("body", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : " ";
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  const html = `<p>Phonebook has info for ${persons.length} people</p>
<p>${new Date().toString()}</p>`;

  res.send(html);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((p) => p.id === id);

  if (person) {
    return res.json(person);
  }

  res.status(404).json({ error: "Person not found" });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;

  const personExists = persons.some((p) => p.id === id);
  if (!personExists) {
    return res.status(404).json({ error: "Person not found" });
  }

  persons = persons.filter((p) => p.id !== id);

  res.sendStatus(204);
});

function generateId() {
  return String(Math.trunc(Math.random() * 1_000_000 + 1));
}

app.post("/api/persons", (req, res) => {
  const person = req.body;

  if (!person.name || !person.number) {
    return res
      .status(400)
      .json({ error: "Invalid JSON. Missing name or number" });
  }

  const hasName = persons.some(
    (p) => p.name.toLowerCase().trim() === person.name.toLowerCase().trim(),
  );

  if (hasName) {
    return res.status(400).json({ error: "Name must be unique" });
  }

  const newPerson = {
    ...person,
    id: generateId(),
  };

  persons = [...persons, newPerson];

  res.status(201).json(newPerson);
});

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: "Unknown endpoint" });
};
app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
