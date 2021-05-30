'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();

const OFFERS_PER_PAGE = 8;

const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = OFFERS_PER_PAGE;
  const offset = (page - 1) * OFFERS_PER_PAGE;

  const [
    {count, offers},
    categories,
  ] = await Promise.all([
    api.getOffers({comments: false, limit, offset}),
    api.getCategories(true),
  ]);

  const totalPagesCount = Math.ceil(count / OFFERS_PER_PAGE);

  res.render(`main`, {offers, categories, page, totalPagesCount});
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
