const { response } = require("../app.js");
const db = require("../connection.js");

exports.fetchTopics = () => {
  return db
    .query("SELECT * FROM topics;")
    .then((response) => {
      return response.rows;
    })
    .catch((err) => {
      console.log(err, "in model");
    });
};

//-----draft-----//
// if (response.rows.length === 0) {
//   return Promise.reject({ status: 404, msg: "topics not found" });
// } else {
//   return response.rows;
// }
