const { fetchEndpoints } = require("../models/endpoints.model");

exports.getEndpoints = (req, res, next) => {
  res.status(200).send(fetchEndpoints());
};
