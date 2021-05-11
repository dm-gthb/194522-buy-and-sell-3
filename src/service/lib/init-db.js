'use strict';

const {ExitCode} = require(`../../constants`);
const defineModels = require(`../models`);
const Aliase = require(`../models/aliase`);

module.exports = async (sequelize, data, logger) => {
  const {offers, categories} = data;

  try {
    logger.info(`Trying to fill database...`);

    const {Category, Offer} = defineModels(sequelize);
    await sequelize.sync({force: true});

    const categoryModels = await Category.bulkCreate(
        categories.map((category) => ({name: category}))
    );

    const transformCategoriesNamesToIds = (categoriesNames, categoryNameToId) => {
      return categoriesNames.map((categoryName) => categoryNameToId[categoryName]);
    };

    const categoryNameToIdMap = categoryModels.reduce((acc, current) => {
      return {
        ...acc,
        [current.name]: current.id
      };
    }, {});

    await Promise.all([
      offers.map(async (offer) => {
        const offerModel = await Offer.create(offer, {include: [Aliase.COMMENTS]});
        await offerModel.addCategories(transformCategoriesNamesToIds(offer.category, categoryNameToIdMap));
      })
    ]);

    logger.info(`DB was successfully filled with mock data.`);
  } catch (err) {
    logger.error(`An error occured on filling database: ${err.message}`);
    process.exit(ExitCode.ERROR);
  }
};
