import express from "express";
import morgan from "morgan";
const app = express();

app.use(express.json());

const requestLogger = (request, response, next) => {
  console.log(`Method: ${request.method}`);
  console.log(`Path: ${request.path}`);
  console.log(`Body: ${request.body}`);
  console.log(`---`);
  next();
};

app.use(requestLogger);

app.use(morgan('tiny'));

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
  res.send(
    `<p>Phonebook has info for ${
      persons.length
    } people </p> </br> <p>${new Date()}</p>`
  );
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

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

app.post("/api/persons/", (req, res) => {
  const body = req.body;
  if (!body.name) {
    return res.status(400).json({
      error: "name missing",
    });
  }

  if (!body.number) {
    return res.status(400).json({
      error: "number missing",
    });
  }

  if (persons.find((person) => person.name === body.name)) {
    return res.status(400).json({
      error: "name already exists",
    });
  }

  const person = {
    id: generateRandomId(),
    name: body.name,
    number: body.number,
  };
  persons = persons.concat(person);
  res.json(person);
});

const generateRandomId = () => {
  const MAX_IDS = 1_000_000;
  const id = Math.floor(Math.random() * MAX_IDS);
  while (true) {
    const person = persons.find((person) => person.id === id);
    if (!person) {
      return id;
    } else {
      id = Math.floor(Math.random() * 1_000_000);
    }
  }
};



const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
