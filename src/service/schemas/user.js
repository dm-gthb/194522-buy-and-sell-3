'use strict';

const Joi = require(`joi`);

const PASSWORD_MIN_LENGTH = 6;
const NAME_MIN_LENGTH = 1;

module.exports = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(PASSWORD_MIN_LENGTH).required(),
  passwordRepeated: Joi.string().required().valid(Joi.ref(`password`)),
  name: Joi.string().min(NAME_MIN_LENGTH).required(),
  avatar: Joi.string().required(),
});
