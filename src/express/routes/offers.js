'use strict';

const {Router} = require(`express`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const csrf = require(`csurf`);
const {OFFERS_PER_PAGE} = require(`../../constants`);
const {ensureArray, createStorage} = require(`../../utils`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);
const privateRoute = require(`../middlewares/private-route`);
const api = require(`../api`).getAPI();

const UPLOAD_DIR = `../upload/img/`;
const UNIQUE_NAME_LENGTH = 10;

const csrfProtection = csrf();
const offersRouter = new Router();
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);
const upload = createStorage(uploadDirAbsolute, nanoid(UNIQUE_NAME_LENGTH));

offersRouter.get(`/add`, csrfProtection, privateRoute, async (req, res) => {
  const {error} = req.query;
  const {user} = req.session;
  const categories = await api.getCategories();
  res.render(`offers/new-ticket`, {categories, user, error, csrfToken: req.csrfToken()});
});

offersRouter.get(`/edit/:offerId`, privateRoute, routeParamsValidator, csrfProtection, async (req, res) => {
  const {offerId: id} = req.params;
  const {error} = req.query;
  const {user} = req.session;
  const [offer, categories] = await Promise.all([
    api.getOffer(id, {isWithComments: false}),
    api.getCategories()
  ]);
  res.render(`offers/ticket-edit`, {offer, user, categories, error, id, csrfToken: req.csrfToken()});
});

offersRouter.get(`/:offerId`, routeParamsValidator, csrfProtection, async (req, res) => {
  const {offerId: id} = req.params;
  const {user} = req.session;
  const {error} = req.query;
  const offer = await api.getOffer(id, {isWithComments: true});
  res.render(`offers/ticket`, {offer, user, id, error, csrfToken: req.csrfToken()});
});

offersRouter.get(`/category/:categoryId`, routeParamsValidator, async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = OFFERS_PER_PAGE;
  const offset = (page - 1) * OFFERS_PER_PAGE;

  const {categoryId: id} = req.params;
  const [
    {count, offers},
    categories,
    category,
  ] = await Promise.all([
    api.getOffersByCategory(id, limit, offset),
    api.getCategories(true),
    api.getCategory(id),
  ]);

  const totalPagesCount = Math.ceil(count / OFFERS_PER_PAGE);
  const {user} = req.session;
  res.render(`category`, {count, offers, categories, category, page, totalPagesCount, user});
});

offersRouter.post(`/add`, privateRoute, upload.single(`avatar`), csrfProtection, async (req, res) => {
  const {body, file} = req;
  const {user} = req.session;
  const offerData = {
    userId: user.id,
    categories: ensureArray(body.categories),
    description: body.comment,
    picture: file ? file.filename : undefined,
    title: body[`ticket-name`],
    type: body.action,
    sum: body.price,
  };
  try {
    await api.createOffer(offerData);
    res.redirect(`/my`);
  } catch (error) {
    res.redirect(`/offers/add?error=${encodeURIComponent(error.response.data)}`);
  }
});

offersRouter.post(`/edit/:offerId`, privateRoute, upload.single(`avatar`), csrfProtection, routeParamsValidator, async (req, res) => {
  const {body, file} = req;
  const {offerId: id} = req.params;
  const {user} = req.session;
  const offerData = {
    userId: user.id,
    categories: ensureArray(body.categories),
    description: body.comment,
    picture: file ? file.filename : body[`old-image`],
    title: body[`ticket-name`],
    type: body.action,
    sum: body.price,
  };
  try {
    await api.editOffer(id, offerData);
    res.redirect(`/my`);
  } catch (error) {
    res.redirect(`/offers/edit/${id}?error=${encodeURIComponent(error.response.data)}`);
  }
});

offersRouter.post(`/:offerId/comments`, privateRoute, routeParamsValidator, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {comment} = req.body;
  const {offerId: id} = req.params;
  try {
    await api.createComment(id, {userId: user.id, text: comment});
    res.redirect(`/offers/${id}`);
  } catch (error) {
    res.redirect(`/offers/${id}?error=${encodeURIComponent(error.response.data)}`);
  }
});

module.exports = offersRouter;
