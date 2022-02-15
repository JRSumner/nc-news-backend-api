const db = require("../connection.js");

exports.fetchArticles = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then((response) => {
      const article = { articles: response.rows[0] };
      return article;
    })
    .catch((err) => {
      console.log(err);
    });
};
