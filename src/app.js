const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

const validateId = (request, response, next) => {
  let { id } = request.params;
  if (typeof id !== "undefined" && id) {
    if (repositories.findIndex((repo) => repo.id === id) >= 0) {
      return next();
    } else {
      response.status(400).json({
        error: "Repo does not exist.",
      });
    }
  } else {
    response.status(400).json({
      error: "Repo does not exist.",
    });
  }
};

const validate = (request, response, next) => {
  let { title, url, techs, likes } = request.body;
  let { id } = request.params;
  if (request.method !== "POST") {
    if (repositories.findIndex((repo) => repo.id === id) >= 0) {
      return next();
    } else {
      response.status(400).json({
        error: "Repo does not exist.",
      });
    }

    if (typeof id !== "undefined" && id) {
      return next();
    } else {
      response.status(400).json({
        error: "Repo does not exist.",
      });
    }
  }

  if (typeof likes !== "undefined" && likes) {
    response.status(400).json({
      error: "Change likes of a repository is not allowed from here.",
    });
  }

  if (
    typeof title !== "undefined" &&
    title &&
    typeof url !== "undefined" &&
    url
  ) {
    return next();
  } else {
    response.status(400).json({ error: "Title and url are mandatory" });
  }
};

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", validate, (request, response) => {
  let { title, url, techs } = request.body;
  let repo = { id: uuid(), title: title, url: url, techs: techs, likes: 0 };
  repositories.push(repo);
  return response.json(repo);
});

app.put("/repositories/:id", validate, (request, response) => {
  let { id } = request.params;
  let { title, url, techs } = request.body;
  let repoIndex = repositories.findIndex((repo) => repo.id === id);
  let repo = {
    id: id,
    title: title,
    url: url,
    techs: techs,
    likes: repositories[repoIndex].likes,
  };
  repositories[repoIndex] = repo;
  return response.json(repo);
});

app.delete("/repositories/:id", validate, (request, response) => {
  let { id } = request.params;
  let repoIndex = repositories.findIndex((repo) => repo.id === id);
  repositories.splice(repoIndex, 1);
  return response.status(204).send();
});

app.post("/repository-likes/:id", validateId, (request, response) => {
  let { id } = request.params;
  let repoIndex = repositories.findIndex((repo) => repo.id === id);
  repositories[repoIndex].likes = repositories[repoIndex].likes + 1;
  return response.json(repositories[repoIndex]);
});

module.exports = app;
