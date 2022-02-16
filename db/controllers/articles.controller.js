const { response } = require("../app.js");
const { updateVotes } = require("../models/articles.model.js");
const { fetchArticles } = require("../models/articles.model.js");

exports.getArticles = (req, res, next) => {
  const id = req.params.article_id;
  fetchArticles(id)
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
      console.log(err, "controller");
      next(err);
    });
};
