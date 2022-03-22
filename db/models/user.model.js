const db = require("../connection.js");

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows: users }) => {
    return users;
  });
};

exports.fetchSingleUser = (username) => {
  const specialChars = /[`!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?~]/;
  if (specialChars.test(username))
    return Promise.reject({ status: 400, msg: "bad request" });

  return db
    .query(`SELECT * FROM users WHERE username = $1;`, [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "no user matching that id",
        });
      }
      return { user: rows[0] };
    });
};
