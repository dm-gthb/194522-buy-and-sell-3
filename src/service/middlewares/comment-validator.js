'use strict';

const {StatusCode} = require(`../../constants`);

const commentKeys = [`text`];

module.exports = (req, res, next) => {
  const comment = req.body;
  const keys = Object.keys(comment);
  const areKeysExist = commentKeys.every((key) => keys.includes(key));

  if (!areKeysExist) {
    return res.status(StatusCode.BAD_REQUEST).send(`Bad request`);
  }

  return next();
};
