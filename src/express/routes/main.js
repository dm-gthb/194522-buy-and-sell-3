'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();

const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  const offers = await api.getOffers();
  res.render(`main`, {offers});
});

mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`login`));

mainRouter.get(`/search`, async (req, res) => {
  try {
    const {title} = req.query;
    const searchResults = await api.search(title);
    res.render(`search-result`, {searchResults});
  } catch (err) {
    res.render(`search-result`, {searchResults: []});
  }
});

module.exports = mainRouter;
