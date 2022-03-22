const res = require("express/lib/response");
const { fetchTopics } = require("../models/topics.model.js");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topicsArray) => {
      res.status(200).send({ topics: topicsArray });
    })
    .catch((err) => {
      next(err);
    });
};
