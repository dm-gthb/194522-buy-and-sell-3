'use strict';

const {Router} = require(`express`);
const {StatusCode} = require(`../../constants`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/search`, route);

  route.get(`/`, async (req, res) => {
    const {query = ``} = req.query;

    if (!query) {
      return res.status(StatusCode.BAD_REQUEST).json([]);
    }

    const searchResult = await service.findAll(query);
    const searchStatus = searchResult.length > 0 ? StatusCode.OK : StatusCode.NOT_FOUND;

    return res.status(searchStatus).json(searchResult);
  });
};
