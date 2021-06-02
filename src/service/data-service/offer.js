'use strict';

const Aliase = require(`../models/aliase`);

class OfferService {
  constructor(sequelize) {
    this._Offer = sequelize.models.Offer;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._OfferCategory = sequelize.models.OfferCategory;
  }

  async create(offerData) {
    const offer = await this._Offer.create(offerData);
    await offer.addCategories(offerData.categories);
    return offer.get();
  }

  async delete(id) {
    const deletedRows = await this._Offer.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  findOne(id, isWithComments) {
    const include = [Aliase.CATEGORIES];
    if (isWithComments) {
      include.push(Aliase.COMMENTS);
    }
    return this._Offer.findByPk(id, {include});
  }

  async findAll(isWithComments) {
    const include = [Aliase.CATEGORIES];
    if (isWithComments) {
      include.push(Aliase.COMMENTS);
    }
    const offers = await this._Offer.findAll({include});
    return offers.map((item) => item.get());
  }

  async findPageByCategory(categoryId, limit, offset) {
    const {count, rows} = await this._Offer.findAndCountAll({
      limit,
      offset,
      include: [{
        model: this._OfferCategory,
        as: Aliase.OFFER_CATEGORIES,
        attributes: [],
        where: {
          CategoryId: categoryId
        },
        distinct: true
      }],
    });
    return {count, offers: rows};
  }

  async findPage(limit, offset) {
    const {count, rows} = await this._Offer.findAndCountAll({
      limit,
      offset,
      include: [Aliase.CATEGORIES],
      distinct: true
    });
    return {count, offers: rows};
  }

  async update(id, offer) {
    const [affectedRows] = await this._Offer.update(offer, {
      where: {id}
    });
    return !!affectedRows;
  }
}

module.exports = OfferService;
