'use strict';

const {StatusCode} = require(`../../constants`);

module.exports = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, {abortEarly: false});
    } catch (error) {
      const errorsMessages = error.details.map((err) => err.message);
      return res.status(StatusCode.BAD_REQUEST).json(errorsMessages);
    }

    return next();
  };
};
