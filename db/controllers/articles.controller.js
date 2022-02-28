const { response } = require("../app.js");
const {
  updateVotes,
  fetchArticles,
  fetchArticleById,
  fetchArticleComments,
  addComment,
} = require("../models/articles.model.js");

exports.getArticleById = (req, res, next) => {
  const id = req.params.article_id;
  fetchArticleById(id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchVotes = (req, res, next) => {
  const votes = req.body.votes;
  const id = req.params.article_id;
  updateVotes(votes, id)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const sort_by = req.query.sort_by;
  fetchArticles(sort_by)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleComments = (req, res, next) => {
  const id = req.params.article_id;
  fetchArticleComments(id)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const comment = req.body.body;
  const username = req.body.username;
  const id = req.params.article_id;
  addComment(username, id)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      next(err);
    });
};
