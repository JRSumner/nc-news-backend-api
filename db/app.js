const express = require("express");
const {
  getArticles,
  patchVotes,
} = require("./controllers/articles.controller");
const { getTopics } = require("./controllers/topics.controller");
const { handlesBadPath, handlesCustomErrors } = require("./error");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticles);

app.patch("/api/articles/:article_id", patchVotes);

app.all("/*", handlesBadPath);

app.use(handlesCustomErrors);

module.exports = app;
