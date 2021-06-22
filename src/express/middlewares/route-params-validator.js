'use strict';

const Joi = require(`joi`);
const {StatusCode} = require(`../../constants`);

const schema = Joi.object({
  offerId: Joi.number().integer().min(1),
  commentId: Joi.number().integer().min(1),
  categoryId: Joi.number().integer().min(1),
});

module.exports = (req, res, next) => {
  const {error} = schema.validate(req.params);

  if (error) {
    return res.status(StatusCode.BAD_REQUEST).render(`errors/404`);
  }

  return next();
};

