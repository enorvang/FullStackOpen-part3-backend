import express, { response } from "express";
const app = express();

let persons = [
  {
    id: 1,
    name: "Espen Norvang",
    number: "91863395",
  },
  {
    id: 2,
    name: "Ingrid Thorkildsen",
    number: "12332123",
  },
  {
    id: 3,
    name: "Morten Sund",
    number: "33221122",
  },
  {
    id: 4,
    name: "Matthew Raft",
    number: "98631234",
  },
];

app.get("/", (req, res) => {
  res.send("<h1> Hello World! </h1>");
});

app.get("/info", (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people </p> </br> <p>${new Date()}</p>`);
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
