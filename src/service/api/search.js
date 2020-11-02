'use strict';

const {Router} = require(`express`);
const {StatusCode} = require(`../../constants`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/search`, route);

  route.get(`/`, (req, res) => {
    const {query = ``} = req.params;

    if (!query) {
      return res.status(StatusCode.BAD_REQUEST).json([]);
    }

    const searchResult = service.findAll(query);
    const searchStatus = searchResult.length > 0 ? StatusCode.OK : StatusCode.NOT_FOUND;

    return res.status(searchStatus).json(searchResult);
  });
};
