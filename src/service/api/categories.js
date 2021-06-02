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

  route.get(`/:id`, async (req, res) => {
    const {id} = req.params;
    const category = await service.findOne(id);
    return res.status(StatusCode.OK).json(category);
  });
};
