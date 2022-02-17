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

exports.fetchArticles = (sort_by = "not valid") => {
  const validSortBys = ["created_at"];

  if (!validSortBys.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  return db
    .query(
      `SELECT article_id, title, topic, author, created_at, votes FROM articles ORDER BY ${sort_by} ASC;`
    )
    .then((response) => {
      return response.rows;
    })
    .catch((err) => {
      console.log(err);
    });
};

// {
//   title: "Sony Vaio; or, The Laptop",
//   topic: "mitch",
//   author: "icellusedkars",
//   body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
//   created_at: 1602828180000,
//   votes: 0,
// }
