'use strict';

const {Router} = require(`express`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const {OFFERS_PER_PAGE} = require(`../../constants`);
const {createStorage} = require(`../../utils`);
const api = require(`../api`).getAPI();

const UPLOAD_DIR = `../upload/img/`;
const UNIQUE_NAME_LENGTH = 10;
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);
const upload = createStorage(uploadDirAbsolute, nanoid(UNIQUE_NAME_LENGTH));

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

mainRouter.get(`/register`, (req, res) => {
  res.render(`sign-up`);
});

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

mainRouter.post(`/user`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;

  const userData = {
    email: body[`user-email`],
    name: body[`user-name`],
    password: body[`user-password`],
    passwordRepeated: body[`user-password-again`],
    avatar: file ? file.filename : undefined,
  };

  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (error) {
    res.render(`sign-up`, {error: error.response.data, userData});
  }
});

module.exports = mainRouter;
