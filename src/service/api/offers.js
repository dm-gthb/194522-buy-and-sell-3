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
    const {isWithComments, isOffersSortedByComments, categoryId, userId, offset, limit} = req.query;

    const findAllOffers = async () => await offerService.findAll();
    const findOffersPage = async () => await offerService.findPage(limit, offset);
    const findAllOffersByUser = async () => await offerService.findByUser({userId, isWithComments});
    const findOffersPageByCategory = async () => await offerService.findPageByCategory(categoryId, limit, offset);
    const findFistMostDiscussedOffers = async () => await offerService.findPageSortedByComments(limit);

    if (userId) {
      const offers = await findAllOffersByUser({userId, isWithComments});
      return res.status(StatusCode.OK).json(offers);
    }

    if (categoryId) {
      const result = await findOffersPageByCategory(categoryId, limit, offset);
      return res.status(StatusCode.OK).json(result);
    }

    if (isOffersSortedByComments) {
      const offers = await findFistMostDiscussedOffers(limit);
      return res.status(StatusCode.OK).json(offers);
    }

    const isFindPage = limit || offset;
    const offers = isFindPage ? await findOffersPage() : await findAllOffers();

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
