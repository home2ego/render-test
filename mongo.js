const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.6ym4zx0.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url, { family: 4 });

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

const notes = [
  {
    content: "HTML is easy",
    important: true,
  },
  {
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

Note.insertMany(notes).then(() => {
  console.log("All notes saved!");
  mongoose.connection.close();
});
