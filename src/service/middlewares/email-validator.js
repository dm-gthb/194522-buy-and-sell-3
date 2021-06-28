'use strict';

const {StatusCode} = require(`../../constants`);

module.exports = (service) => {
  return async (req, res, next) => {
    const userByEmail = await service.findByEmail(req.body.email);
    if (userByEmail) {
      return res.status(StatusCode.BAD_REQUEST).send(`${req.body.email} address is already in use`);
    }

    return next();
  };
};
