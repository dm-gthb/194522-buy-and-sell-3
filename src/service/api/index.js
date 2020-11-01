'use strict';

const {Router} = require(`express`);
const getMockData = require(`../lib/get-mock-data`);
const offers = require(`../api/offers`);
const categories = require(`../api/categories`);
const search = require(`../api/search`);
const {
  CategoryService,
  SearchService,
  OfferService,
  CommentService,
} = require(`../data-service`);

const app = new Router();

(async () => {
  const mockData = await getMockData();
  offers(app, new OfferService(mockData), new CommentService());
  categories(app, new CategoryService(mockData));
  search(app, new SearchService(mockData));
})();

module.exports = app;
