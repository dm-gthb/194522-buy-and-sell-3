'use strict';

const Sequelize = require(`sequelize`);
const {Op} = require(`sequelize`);
const Aliase = require(`../models/aliase`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._OfferCategory = sequelize.models.OfferCategory;
  }

  async findOne(id) {
    return this._Category.findByPk(id);
  }

  async findAll(isNeedCount = false) {
    if (isNeedCount) {
      const result = await this._Category.findAll({
        attributes: [
          `id`,
          `name`,
          [
            Sequelize.fn(
                `COUNT`,
                `*`
            ),
            `count`
          ]
        ],
        group: [Sequelize.col(`Category.id`)],
        include: [{
          model: this._OfferCategory,
          as: Aliase.OFFER_CATEGORIES,
          attributes: []
        }],
        having: Sequelize.where(
            Sequelize.fn(
                `COUNT`,
                Sequelize.col(`CategoryId`)
            ),
            {
              [Op.gte]: 1
            }
        )
      });
      return result.map((category) => category.get());
    }

    return this._Category.findAll({raw: true});
  }
}

module.exports = CategoryService;
