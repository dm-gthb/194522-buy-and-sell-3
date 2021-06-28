'use strict';

const Joi = require(`joi`);

const COMMENT_MIN_LENGTH = 20;

module.exports = Joi.object({
  userId: Joi.number().integer().positive().required(),
  text: Joi.string().min(COMMENT_MIN_LENGTH).required()
});
