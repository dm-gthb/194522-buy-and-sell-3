'use strict';

const Joi = require(`joi`);

const DescriptionLength = {
  MIN: 50,
  MAX: 1000,
};

const TitleLength = {
  MIN: 10,
  MAX: 100,
};

const OfferType = {
  OFFER: `offer`,
  SALE: `sale`,
};

const CATEGORIES_MIN_COUNT = 1;
const MIN_SUM = 100;

module.exports = Joi.object({
  categories: Joi.array()
    .items(Joi.number().integer().positive())
    .min(CATEGORIES_MIN_COUNT)
    .required(),

  description: Joi.string()
    .min(DescriptionLength.MIN)
    .max(DescriptionLength.MAX)
    .required(),

  picture: Joi.string().required(),

  title: Joi.string()
    .min(TitleLength.MIN)
    .max(TitleLength.MAX)
    .required(),

  type: Joi.string()
    .valid(OfferType.OFFER, OfferType.SALE)
    .required(),

  sum: Joi.number()
    .integer()
    .positive()
    .greater(MIN_SUM)
    .required(),
});
