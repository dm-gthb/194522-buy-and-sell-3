'use strict';

const {StatusCode} = require(`../../constants`);

module.exports = (schema) => {
  return (req, res, next) => {
    const {error} = schema.validate(req.body, {abortEarly: false});
    if (error) {
      const errorsMessages = error.details.map((err) => err.message);
      return res.status(StatusCode.BAD_REQUEST).json(errorsMessages);
    }

    return next();
  };
};
