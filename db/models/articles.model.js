const db = require("../connection.js");

exports.fetchArticles = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then((response) => {
      console.log(response.rows[0]);
      const articles = { articles: response.rows[0] };
      return articles;
    })
    .catch((err) => {
      console.log(err);
    });
};
