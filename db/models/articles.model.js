const db = require("../connection.js");

exports.fetchArticleById = (id) => {
  if (isNaN(id)) return Promise.reject({ status: 400, msg: "bad request" });

  return db
    .query(
      `SELECT author, title, article_id, body, topic, created_at, votes, 
      (SELECT COUNT(*) FROM comments WHERE articles.article_id = comments.article_id)
      AS comment_count FROM articles WHERE article_id = $1`,
      [id]
    )
    .then(({ rows }) => {
      const article = { articles: rows[0] };
      if (rows.length === 0)
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
    .then(({ rows: votedArticle }) => {
      if (votedArticle.length === 0)
        return Promise.reject({
          status: 404,
          msg: "no article matching that id",
        });
      return votedArticle[0];
    });
};

exports.fetchArticles = (sort_by = "created_at", order = "DESC", topic) => {
  const validSortBys = ["created_at"];
  const validOrder = ["ASC", "DESC"];
  if (!validSortBys.includes(sort_by) || !validOrder.includes(order))
    return Promise.reject({ status: 400, msg: "bad request" });

  return db
    .query(
      `SELECT article_id, title, topic, author, created_at, votes, (SELECT COUNT(*)
         FROM comments WHERE articles.article_id = comments.article_id)
         AS comment_count FROM articles WHERE topic = $1
         ORDER BY ${sort_by} ${order};`,
      [topic]
    )
    .then(({ rows: articles }) => {
      return articles;
    })
    .catch((err) => {
      next(err);
    });
};
