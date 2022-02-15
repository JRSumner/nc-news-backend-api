exports.handlesBadPath = (req, res) => {
  res.status(404).send({ message: "path not found" });
};

exports.handlesBadRequest = (err, req, res, next) => {
  res.status(404).send({ message: "no article matching that id" });
};

exports.handlesCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
};
