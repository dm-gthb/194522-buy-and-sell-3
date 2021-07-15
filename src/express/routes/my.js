'use strict';

const {Router} = require(`express`);
const privateRoute = require(`../middlewares/private-route`);
const api = require(`../api`).getAPI();

const myRouter = new Router();

myRouter.use(privateRoute);

myRouter.get(`/`, async (req, res) => {
  const {user} = req.session;
  const offers = await api.getOffersByUser({userId: user.id, isWithComments: false});
  res.render(`my-tickets`, {user, offers});
});

myRouter.get(`/comments`, async (req, res) => {
  const {user} = req.session;
  const offers = await api.getOffersByUser({userId: user.id, isWithComments: true});
  res.render(`comments`, {user, offers});
});

myRouter.post(`/:offerId/comments/:commentId`, async (req, res) => {
  const {offerId, commentId} = req.params;
  await api.deleteComment({offerId, commentId});
  res.redirect(`/my/comments`);
});

myRouter.post(`/:offerId`, async (req, res) => {
  const {offerId} = req.params;
  await api.deleteOffer(offerId);
  res.redirect(`/my`);
});

module.exports = myRouter;
