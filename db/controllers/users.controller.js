const { fetchUsers, fetchSingleUser } = require("../models/user.model.js");

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getSingleUser = (req, res, next) => {
  const username = req.params.username;
  fetchSingleUser(username)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      next(err);
    });
};
