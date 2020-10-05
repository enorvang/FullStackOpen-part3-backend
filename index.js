require("dotenv").config();
import express from "express";
import morgan from "morgan";
import cors from "cors";
const Person = require("./models/person");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("build"));

const requestLogger = (request, response, next) => {
  console.log(`Method: ${request.method}`);
  console.log(`Path: ${request.path}`);
  console.log(`Body: ${JSON.stringify(request.body)}`);
  console.log(`---`);
  next();
};

app.use(requestLogger);

morgan.token("person", (request, response) => {
  const body = request.body;
  if (body) {
    return JSON.stringify(body);
  } else {
    return "";
  }
});

app.use(morgan(":method :url :response-time :person"));


app.get("/", (req, res) => {
  res.send("<h1> Hello World! </h1>");
});

/* TODO: get info from db.
app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${
      persons.length
    } people </p> </br> <p>${new Date()}</p>`
  );
});
*/
app.get("/api/people", (req, res) => {
  Person.find({}).then((people) => {
    res.json(people);
  });
});

app.get("/api/people/:id", (req, res) => {
  Person.findById(req.params.id).then((p) => {
    res.json(p);
  });
});
/* TODO: delete  from database!
app.delete("/api/people/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});
*/
app.post("/api/people", (req, res) => {
  const body = req.body;
  if (body.name === undefined || body.number === undefined) {
    return res.status(400).json({ error: "name and/or number missing" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
