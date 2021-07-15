'use strict';

const Sequelize = require(`sequelize`);
const {Op} = require(`sequelize`);
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

    const order = isWithComments ? [[Aliase.COMMENTS, `createdAt`, `DESC`]] : null;
    const offer = await this._Offer.findByPk(id, {include, order});
    return offer;
  }

  async findAll() {
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
    const offers = await this._Offer.findAll({include});
    return offers.map((item) => item.get());
  }

  async findPageByCategory(categoryId, limit, offset) {
    const {count, rows} = await this._Offer.findAndCountAll({
      limit,
      offset,
      include: [
        Aliase.CATEGORIES,
        {
          model: this._OfferCategory,
          as: Aliase.OFFER_CATEGORIES,
          attributes: [],
          where: {
            CategoryId: categoryId
          },
        },
      ],
      distinct: true,
    });
    return {count, offers: rows};
  }

  async findByUser({userId, isWithComments}) {
    const include = [
      Aliase.CATEGORIES,
      {
        model: this._User,
        as: Aliase.USER,
        attributes: {
          exclude: [`passwordHash`],
        },
        where: {
          id: userId,
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

    const order = isWithComments ? [[Aliase.COMMENTS, `createdAt`, `DESC`]] : [[`createdAt`, `DESC`]];

    const offersByUser = await this._Offer.findAll({
      include,
      distinct: true,
      order
    });
    return offersByUser.map((offer) => offer.get());
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
      order: [[`createdAt`, `DESC`]],
      distinct: true
    });
    return {count, offers: rows};
  }

  async findPageSortedByComments(limit) {
    const offers = await this._Offer.findAll({
      limit,
      attributes: {
        include: [
          [
            Sequelize.literal(
                `(SELECT COUNT(*) FROM comments WHERE "comments"."offerId" = "Offer"."id")`
            ),
            `countComments`
          ],
        ],
      },
      include: [
        Aliase.CATEGORIES,
        Aliase.COMMENTS
      ],
      order: [Sequelize.literal(`"countComments" DESC`)],
      group: [Sequelize.col(`Offer.id`)],
      having: Sequelize.where(
          Sequelize.literal(
              `(SELECT COUNT(*) FROM comments WHERE "comments"."offerId" = "Offer"."id")`
          ),
          {
            [Op.gte]: 1,
          }
      )
    });

    return offers.map((offer) => offer.get());
  }

  async update(id, offer) {
    const [affectedRows] = await this._Offer.update(offer, {
      where: {id}
    });
    return !!affectedRows;
  }
}

module.exports = OfferService;
