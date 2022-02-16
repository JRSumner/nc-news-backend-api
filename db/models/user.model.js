const db = require("../connection.js");

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users`).then((response) => {
    return response.rows;
  });
};
