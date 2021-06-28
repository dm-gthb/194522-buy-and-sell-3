'use strict';

const {Router} = require(`express`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const {OFFERS_PER_PAGE} = require(`../../constants`);
const {ensureArray, createStorage} = require(`../../utils`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);
const api = require(`../api`).getAPI();

const UPLOAD_DIR = `../upload/img/`;
const UNIQUE_NAME_LENGTH = 10;

const offersRouter = new Router();
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);
const upload = createStorage(uploadDirAbsolute, nanoid(UNIQUE_NAME_LENGTH));

offersRouter.get(`/add`, async (req, res) => {
  const {error} = req.query;
  const categories = await api.getCategories();
  res.render(`offers/new-ticket`, {categories, error});
});

offersRouter.get(`/edit/:offerId`, routeParamsValidator, async (req, res) => {
  const {offerId: id} = req.params;
  const {error} = req.query;
  const [offer, categories] = await Promise.all([
    api.getOffer(id, {isWithComments: false}),
    api.getCategories()
  ]);
  res.render(`offers/ticket-edit`, {offer, categories, error, id});
});

offersRouter.get(`/:offerId`, routeParamsValidator, async (req, res) => {
  const {offerId: id} = req.params;
  const {error} = req.query;
  const offer = await api.getOffer(id, {isWithComments: true});
  res.render(`offers/ticket`, {offer, id, error});
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
  res.render(`category`, {count, offers, categories, category, page, totalPagesCount});
});

offersRouter.post(`/add`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const offerData = {
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

offersRouter.post(`/edit/:offerId`, upload.single(`avatar`), routeParamsValidator, async (req, res) => {
  const {body, file} = req;
  const {offerId: id} = req.params;
  const offerData = {
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

offersRouter.post(`/:offerId/comments`, routeParamsValidator, async (req, res) => {
  const {offerId: id} = req.params;
  try {
    await api.createComment(id, {text: req.body.comment});
    res.redirect(`/offers/${id}`);
  } catch (error) {
    res.redirect(`/offers/${id}?error=${encodeURIComponent(error.response.data)}`);
  }
});

module.exports = offersRouter;
