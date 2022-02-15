const express = require("express");
const { getArticles } = require("./controllers/articles.controller");
const { getTopics } = require("./controllers/topics.controller");
const { handlesBadPath } = require("./error");
const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticles);

app.all("/*", handlesBadPath);

module.exports = app;
