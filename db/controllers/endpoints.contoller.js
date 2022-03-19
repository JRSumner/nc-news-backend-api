const { fetchEndpoints } = require("../models/endpoints.model");

exports.getEndpoints = (req, res, next) => {
  fetchEndpoints()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      next(err);
    });
};
