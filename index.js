const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));
//app.use(morgan("tiny"));

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms - :body"
  )
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "no name",
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: "no number",
    });
  }

  const usedName = persons.find((person) => person.name === body.name);

  if (usedName) {
    return response.status(409).json({
      error: `name ${body.name} already registered, name must be unique`,
    });
  }

  const person = {
    id: Math.floor(Math.random() * (1000 - 1) + 1),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/info", (request, response) => {
  const info = persons.length;
  const date = new Date();

  response.send(`<p>Phonebook has info for ${info} people</p>${date}<p></p>`);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  // if (person) {
  //   response.json(person);
  // } else {
  response.status(404).end();
  // }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
