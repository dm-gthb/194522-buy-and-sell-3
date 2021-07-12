'use strict';

const {Router} = require(`express`);
const privateRoute = require(`../middlewares/private-route`);
const api = require(`../api`).getAPI();

const myRouter = new Router();

myRouter.use(privateRoute);

myRouter.get(`/`, async (req, res) => {
  const {user} = req.session;
  const offers = await api.getOffersByUser(user.id);
  res.render(`my-tickets`, {user, offers});
});

myRouter.get(`/comments`, async (req, res) => {
  const offers = await api.getOffers({isWithComments: true});
  const {user} = req.session;
  res.render(`comments`, {user, offers: offers.slice(0, 3)});
});

myRouter.post(`/:offerId`, privateRoute, async (req, res) => {
  const {offerId} = req.params;
  await api.deleteOffer(offerId);
  res.redirect(`/my`);
});

module.exports = myRouter;
