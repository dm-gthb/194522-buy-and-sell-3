'use strict';

const {Router} = require(`express`);
const {StatusCode} = require(`../../constants`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/categories`, route);

  route.get(`/`, (req, res) => {
    const categories = service.findAll();
    return res.status(StatusCode.OK).json(categories);
  });
};
