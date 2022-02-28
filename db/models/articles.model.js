const db = require("../connection.js");

exports.fetchArticleById = (id) => {
  if (isNaN(id)) return Promise.reject({ status: 400, msg: "bad request" });

  return db
    .query(
      `SELECT author, title, article_id, body, topic, created_at, votes, (SELECT COUNT(*) FROM comments WHERE articles.article_id = comments.article_id) AS comment_count FROM articles WHERE article_id = $1`,
      [id]
    )
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

exports.fetchArticles = (sort_by = "created_at") => {
  const validSortBys = ["created_at"];

  if (!validSortBys.includes(sort_by) && sort_by !== undefined) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  if (sort_by === undefined) {
    return db
      .query(
        `SELECT article_id, title, topic, author, created_at, votes, (SELECT COUNT(*) FROM comments WHERE articles.article_id = comments.article_id) AS comment_count FROM articles;`
      )
      .then((response) => {
        return response.rows;
      })
      .catch((err) => {
        next(err);
      });
  } else {
    return db
      .query(
        `SELECT article_id, title, topic, author, created_at, votes, (SELECT COUNT(*) FROM comments WHERE articles.article_id = comments.article_id) AS comment_count FROM articles ORDER BY ${sort_by} ASC;`
      )
      .then((response) => {
        return response.rows;
      })
      .catch((err) => {
        next(err);
      });
  }
};

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
  return db
    .query(
      `INSERT INTO comments (body, votes, author, article_id) VALUES ($1, 0, $2, $3) RETURNING *;`,
      [comment, username, id],
      console.log("hello")
    )
    .then((response) => {
      console.log("hello in here");
    });
};
