const res = require("express/lib/response");
const { fallback_application_name } = require("pg/lib/defaults");
const db = require("../connection.js");

exports.fetchArticlesById = (id) => {
  if (isNaN(id)) return Promise.reject({ status: 400, msg: "bad request" });

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

exports.updateVotes = (votes, id) => {
  if (isNaN(id) || isNaN(votes))
    return Promise.reject({ status: 400, msg: "bad request" });

  return db
    .query(
      `UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *;`,
      [votes, id]
    )
    .then((response) => {
      if (response.rows.length === 0)
        return Promise.reject({
          status: 404,
          msg: "no article matching that id",
        });
      const result = response.rows[0];
      return result;
    });
};
