'use strict';

const {Router} = require(`express`);
const {StatusCode} = require(`../../constants`);
const schemaValidator = require(`../middlewares/schema-validator`);
const offerSchema = require(`../schemas/offer`);
const commentSchema = require(`../schemas/comment`);
const offerExist = require(`../middlewares/offer-exist`);

module.exports = (app, offerService, commentService) => {
  const route = new Router();

  app.use(`/offers`, route);

  route.get(`/`, async (req, res) => {
    const {isWithComments, categoryId, offset, limit} = req.query;

    if (categoryId) {
      const result = await offerService.findPageByCategory(categoryId, limit, offset);
      return res.status(StatusCode.OK).json(result);
    }

    const isFindPage = limit || offset;
    const findPage = async () => await offerService.findPage(limit, offset);
    const findAll = async () => await offerService.findAll(isWithComments);
    const offers = isFindPage ? await findPage() : await findAll();
    return res.status(StatusCode.OK).json(offers);
  });

  route.get(`/:offerId`, offerExist(offerService), async (req, res) => {
    const {offer} = res.locals;
    return res.status(StatusCode.OK).json(offer);
  });

  route.post(`/`, schemaValidator(offerSchema), async (req, res) => {
    const offer = await offerService.create(req.body);
    return res.status(StatusCode.CREATED).json(offer);
  });

  route.put(`/edit/:offerId`, [offerExist(offerService), schemaValidator(offerSchema)], async (req, res) => {
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

  route.post(`/:offerId/comments`, [offerExist(offerService), schemaValidator(commentSchema)], async (req, res) => {
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
