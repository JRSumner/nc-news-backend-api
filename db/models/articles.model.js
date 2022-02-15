const db = require("../connection.js");

exports.fetchArticles = (id) => {
  if (isNaN(id)) return Promise.reject({ status: 404, msg: "bad request" });
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then((response) => {
      const article = { articles: response.rows[0] };
      if (response.rows.length === 0)
        return Promise.reject({
          status: 404,
          msg: "no article matching that id",
        });
      return article;
    });
};
