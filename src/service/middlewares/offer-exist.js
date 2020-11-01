'use strict';

const {StatusCode} = require(`../../constants`);

module.exports = (service) => (req, res, next) => {
  const {offerId} = req.params;
  const offer = service.findOne(offerId);

  if (!offer) {
    return res.status(StatusCode.NOT_FOUND).send(`Offer ${offerId} not found`);
  }
  res.locals.offer = offer;
  return next();
};
