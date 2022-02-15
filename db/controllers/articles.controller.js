const fetchArticles = require("../models/articles.model.js");
console.log(fetchArticles, "<<<");
exports.getArticles = (req, res) => {
  const id = req.params.article_id;
  fetchArticles(id)
    .then((articlesArray) => {
      res.status(200).send(articlesArray);
    })
    .catch((err) => {
      console.log(err);
    });
};
