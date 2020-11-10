'use strict';

const {Router} = require(`express`);
const {StatusCode} = require(`../../constants`);
const commentValidator = require(`../middlewares/comment-validator`);
const offerExist = require(`../middlewares/offer-exist`);
const offerValidator = require(`../middlewares/offer-validator`);

module.exports = (app, offerService, commentService) => {
  const route = new Router();

  app.use(`/offers`, route);

  route.get(`/`, (req, res) => {
    const offers = offerService.findAll();
    return res.status(StatusCode.OK).json(offers);
  });

  route.get(`/:offerId`, offerExist(offerService), (req, res) => {
    const {offer} = res.locals;
    return res.status(StatusCode.OK).json(offer);
  });

  route.post(`/`, offerValidator, (req, res) => {
    const offer = offerService.create(req.body);
    return res.status(StatusCode.CREATED).json(offer);
  });

  route.put(`/:offerId`, offerExist(offerService), offerValidator, (req, res) => {
    const {offerId} = res.locals;
    const updatedOffer = offerService.update(offerId, req.body);
    return res.status(StatusCode.OK).json(updatedOffer);
  });

  route.delete(`/:offerId`, offerExist(offerService), (req, res) => {
    const {offerId} = res.locals;
    const deletedOffer = offerService.delete(offerId);
    return res.status(StatusCode.OK).json(deletedOffer);
  });

  route.get(`/:offerId/comments`, offerExist(offerService), (req, res) => {
    const {offer} = res.locals;
    const comments = commentService.findAll(offer);
    return res.status(StatusCode.OK).json(comments);
  });

  route.post(`/:offerId/comments`, [offerExist(offerService), commentValidator], (req, res) => {
    const {offer} = res.locals;
    const newComment = commentService.create(offer, req.body);
    return res.status(StatusCode.CREATED).json(newComment);
  });

  route.delete(`/:offerId/comments/:commentId`, offerExist(offerService), (req, res) => {
    const {offer} = res.locals;
    const {commentId} = req.params;
    const deletedComment = commentService.delete(offer, commentId);

    if (!deletedComment) {
      return res.status(StatusCode.NOT_FOUND).send(`Comment ${commentId} not found`);
    }

    return res.status(StatusCode.OK).json(deletedComment);
  });
};
