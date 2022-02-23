const express = require("express");
const {
  patchVotes,
  getArticleById,
  getArticles,
  getArticleComments,
} = require("./controllers/articles.controller");
const { getTopics } = require("./controllers/topics.controller");
const { getUsers } = require("./controllers/users.controller");
const { handlesBadPath, handlesCustomErrors } = require("./error");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:article_id", patchVotes);

app.get("/api/users", getUsers);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.all("/*", handlesBadPath);

app.use(handlesCustomErrors);

module.exports = app;
