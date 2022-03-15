const db = require("../connection.js");

exports.fetchArticleComments = (id) => {
  if (isNaN(id)) return Promise.reject({ status: 400, msg: "bad request" });
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1;`, [id])
    .then((response) => {
      if (response.rows.length === 0)
        return Promise.reject({
          status: 404,
          msg: "no article matching that id",
        });
      return response.rows;
    });
};

exports.addComment = (comment, username, id) => {
  if (comment === "")
    return Promise.reject({ status: 400, msg: "bad request" });
  return db
    .query(
      `INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;`,
      [comment, username, id]
    )
    .then((response) => {
      return { comment: response.rows[0] };
    });
};
