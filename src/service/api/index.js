'use strict';

const {Router} = require(`express`);
const offers = require(`../api/offers`);
const categories = require(`../api/categories`);
const search = require(`../api/search`);
const user = require(`./user`);
const defineModels = require(`../models`);
const sequelize = require(`../lib/sequelize`);
const {
  CategoryService,
  SearchService,
  OfferService,
  CommentService,
  UserService,
} = require(`../data-service`);

const app = new Router();

defineModels(sequelize);

(() => {
  offers(app, new OfferService(sequelize), new CommentService(sequelize));
  categories(app, new CategoryService(sequelize));
  search(app, new SearchService(sequelize));
  user(app, new UserService(sequelize));
})();

module.exports = app;
