'use strict';

const {Router} = require(`express`);
const {StatusCode} = require(`../../constants`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const {isNeedCount} = req.query;
    const categories = await service.findAll(isNeedCount);
    return res.status(StatusCode.OK).json(categories);
  });
};
