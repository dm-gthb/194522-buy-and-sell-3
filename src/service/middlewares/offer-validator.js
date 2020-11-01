'use strict';

const {StatusCode} = require(`../../constants`);

const offerKeys = [
  `category`,
  `description`,
  `picture`,
  `title`,
  `type`,
  `sum`
];

module.exports = (req, res, next) => {
  const newOffer = req.body;
  const keys = Object.keys(newOffer);
  const areKeysExist = offerKeys.every((key) => keys.includes(key));

  if (!areKeysExist) {
    res.status(StatusCode.BAD_REQUEST).send(`Bad request`);
  }

  next();
};
