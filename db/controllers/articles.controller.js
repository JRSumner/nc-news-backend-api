const {
  updateVotes,
  fetchArticles,
  fetchArticleById,
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
      console.log(response);
      res.status(200).send(response);
    })
    .catch((err) => {
      next(err);
    });
};
