'use strict';

const Aliase = require(`../models/aliase`);

class OfferService {
  constructor(sequelize) {
    this._Offer = sequelize.models.Offer;
    this._User = sequelize.models.User;
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

  async findOne(id, isWithComments) {
    const include = [
      Aliase.CATEGORIES,
      {
        model: this._User,
        as: Aliase.USER,
        attributes: {
          exclude: [`passwordHash`],
        }
      }
    ];
    if (isWithComments) {
      include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: {
          model: this._User,
          as: Aliase.USER,
          attributes: {
            exclude: [`passwordHash`],
          }
        }
      });
    }

    const offer = await this._Offer.findByPk(id, {include});
    return offer;
  }

  async findAll(isWithComments) {
    const include = [
      Aliase.CATEGORIES,
      {
        model: this._User,
        as: Aliase.USER,
        attributes: {
          exclude: [`passwordHash`],
        }
      }
    ];
    if (isWithComments) {
      include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: {
          model: this._User,
          as: Aliase.USER,
          attributes: {
            exclude: [`passwordHash`],
          }
        }
      });
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
      include: [
        Aliase.CATEGORIES,
        {
          model: this._User,
          as: Aliase.USER,
          attributes: {
            exclude: [`passwordHash`],
          }
        }
      ],
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
