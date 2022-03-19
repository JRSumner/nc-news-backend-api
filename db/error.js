exports.handlesBadPath = (req, res) => {
  res.status(404).send({ message: "path not found :O" });
};

exports.handlesBadRequest = (err, req, res, next) => {
  res.status(404).send({ message: "no article matching that id" });
};

exports.handlesCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
};

exports.handlesSqlError = (err, req, res, next) => {
  if (err.code === "23503") {
    res.status(400).send({ msg: "bad request" });
  }
};
