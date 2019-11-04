const express = require("express");

const server = express();

server.use(express.json());

const projects = [];
var i = 1;

server.use((req, res, next) => {
  console.log(`Número de requisições: ${i}`);
  i++;
  next();
});

function checkIdExists(req, res, next) {
  const { id } = req.params;
  if (!projects.find(p => p.id == id))
    return res.status(400).json({ Erro: "ID Not found" });
  else next();
}

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  const project = { id, title, tasks: [] };

  projects.push(project);

  return res.json(projects);
});

server.put("/projects/:id", checkIdExists, (req, res) => {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  const { title } = req.body;
  project.title = title;

  return res.json(project);
});

server.delete("/projects/:id", checkIdExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

server.post("/projects/:id/tasks", checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);
  project.tasks.push(title);
  return res.json(projects);
});

server.listen(3000);
