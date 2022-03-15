const {
  addComment,
  fetchArticleComments,
  removeComment,
} = require("../models/comments.model.js");

exports.getArticleComments = (req, res, next) => {
  const id = req.params.article_id;
  fetchArticleComments(id)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const comment = req.body.body;
  const username = req.body.username;
  const id = req.params.article_id;
  addComment(comment, username, id)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  const id = req.params.comment_id;
  removeComment(id)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      next(err);
    });
};
