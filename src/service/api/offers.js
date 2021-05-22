'use strict';

const {Router} = require(`express`);
const {StatusCode} = require(`../../constants`);
const commentValidator = require(`../middlewares/comment-validator`);
const offerExist = require(`../middlewares/offer-exist`);
const offerValidator = require(`../middlewares/offer-validator`);

module.exports = (app, offerService, commentService) => {
  const route = new Router();

  app.use(`/offers`, route);

  route.get(`/`, async (req, res) => {
    const {comments} = req.query;
    const offers = await offerService.findAll(comments);
    return res.status(StatusCode.OK).json(offers);
  });

  route.get(`/:offerId`, offerExist(offerService), async (req, res) => {
    const {offer} = res.locals;
    return res.status(StatusCode.OK).json(offer);
  });

  route.post(`/`, offerValidator, async (req, res) => {
    const offer = await offerService.create(req.body);
    return res.status(StatusCode.CREATED).json(offer);
  });

  route.put(`/:offerId`, offerExist(offerService), offerValidator, async (req, res) => {
    const {offerId} = res.locals;
    const updatedOffer = await offerService.update(offerId, req.body);
    return res.status(StatusCode.OK).json(updatedOffer);
  });

  route.delete(`/:offerId`, offerExist(offerService), async (req, res) => {
    const {offerId} = res.locals;
    const deletedOffer = await offerService.delete(offerId);
    return res.status(StatusCode.OK).json(deletedOffer);
  });

  route.get(`/:offerId/comments`, offerExist(offerService), async (req, res) => {
    const {offer} = res.locals;
    const comments = await commentService.findAll(offer.id);
    return res.status(StatusCode.OK).json(comments);
  });

  route.post(`/:offerId/comments`, [offerExist(offerService), commentValidator], async (req, res) => {
    const {offer} = res.locals;
    const newComment = await commentService.create(offer.id, req.body);
    return res.status(StatusCode.CREATED).json(newComment);
  });

  route.delete(`/:offerId/comments/:commentId`, offerExist(offerService), async (req, res) => {
    const {commentId} = req.params;
    const deletedComment = await commentService.delete(commentId);

    if (!deletedComment) {
      return res.status(StatusCode.NOT_FOUND).send(`Comment ${commentId} not found`);
    }

    return res.status(StatusCode.OK).json(deletedComment);
  });
};
