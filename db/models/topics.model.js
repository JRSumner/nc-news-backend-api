const { response } = require("../app.js");
const db = require("../connection.js");

exports.fetchTopics = () => {
  return db
    .query("SELECT * FROM topics;")
    .then((response) => {
      return response.rows;
    })
    .catch((err) => {
      console.log(err);
    });
};
