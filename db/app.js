const express = require("express");
const { getArticles } = require("./controllers/articles.controller");
const { getTopics } = require("./controllers/topics.controller");
const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticles);

app.all("/*", (req, res) => {
  res.status(404).send({ message: "path not found" });
});

module.exports = app;
