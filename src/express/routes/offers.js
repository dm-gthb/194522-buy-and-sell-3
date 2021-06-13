'use strict';

const {Router} = require(`express`);
const path = require(`path`);
const multer = require(`multer`);
const {nanoid} = require(`nanoid`);
const {OFFERS_PER_PAGE} = require(`../../constants`);
const {ensureArray} = require(`../../utils`);
const api = require(`../api`).getAPI();

const UPLOAD_DIR = `../upload/img/`;

const offersRouter = new Router();
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({storage});

offersRouter.get(`/add`, async (req, res) => {
  const {error} = req.query;
  const categories = await api.getCategories();
  res.render(`offers/new-ticket`, {categories, error});
});

offersRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const {error} = req.query;
  const [offer, categories] = await Promise.all([
    api.getOffer(id, {isWithComments: false}),
    api.getCategories()
  ]);
  res.render(`offers/ticket-edit`, {offer, categories, error, id});
});

offersRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const {error} = req.query;
  const offer = await api.getOffer(id, {isWithComments: true});
  res.render(`offers/ticket`, {offer, id, error});
});

offersRouter.get(`/category/:id`, async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = OFFERS_PER_PAGE;
  const offset = (page - 1) * OFFERS_PER_PAGE;

  const {id} = req.params;
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
    picture: file.filename,
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

offersRouter.post(`/edit/:id`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;
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

offersRouter.post(`/:id/comments`, async (req, res) => {
  const {id} = req.params;
  try {
    await api.createComment(id, {text: req.body.comment});
    res.redirect(`/offers/${id}`);
  } catch (error) {
    res.redirect(`/offers/${id}?error=${encodeURIComponent(error.response.data)}`);
  }
});

module.exports = offersRouter;
