'use strict';

const {Router} = require(`express`);
const {StatusCode} = require(`../../constants`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/categories`, route);

  route.get(`/`, (req, res) => {
    const categories = service.findAll();
    return res.status(StatusCode.OK).json(categories);
  });
};
