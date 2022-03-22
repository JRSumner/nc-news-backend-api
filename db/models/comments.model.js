const db = require("../connection.js");

exports.fetchArticleComments = (id) => {
  if (isNaN(id)) return Promise.reject({ status: 400, msg: "bad request" });

  return db
    .query(`SELECT * FROM comments WHERE article_id = $1;`, [id])
    .then(({ rows: comments }) => {
      if (comments.length === 0)
        return Promise.reject({
          status: 404,
          msg: "no article matching that id",
        });
      return comments;
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
    .then(({ rows: [comment] }) => {
      return { comment };
    });
};

exports.removeComment = (id) => {
  if (isNaN(id)) return Promise.reject({ status: 400, msg: "bad request" });
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *", [id])
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({
          status: 404,
          msg: "no comment matching that id",
        });
      return { comment: rows[0] };
    });
};

exports.voteOnComment = (votes, id) => {
  if (isNaN(id) || isNaN(votes))
    return Promise.reject({ status: 400, msg: "bad request" });
  return db
    .query(
      `UPDATE comments SET votes = $1 WHERE comment_id = $2 RETURNING *;`,
      [votes, id]
    )
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({
          status: 404,
          msg: "no comment matching that id",
        });
      return { comment: rows[0] };
    });
};
