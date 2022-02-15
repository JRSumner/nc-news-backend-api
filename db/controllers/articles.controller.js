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
