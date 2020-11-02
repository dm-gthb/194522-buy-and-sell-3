'use strict';

const {StatusCode} = require(`../../constants`);

const commentKeys = [`text`];

module.exports = (req, res, next) => {
  const newComment = req.body;
  const keys = Object.keys(newComment);
  const areKeysExist = commentKeys.every((key) => keys.includes(key));

  if (!areKeysExist) {
    res.status(StatusCode.BAD_REQUEST).send(`Bad request`);
  }

  next();
};
