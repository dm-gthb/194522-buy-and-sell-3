'use strict';

const {ExitCode} = require(`../../constants`);
const defineModels = require(`../models`);
const Aliase = require(`../models/aliase`);
const {getLogger} = require(`./logger`);

const logger = getLogger();

module.exports = async (sequelize, data) => {
  const {users, offers, categories} = data;

  try {
    logger.info(`Trying to fill database...`);

    const {User, Category, Offer} = defineModels(sequelize);
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

    const usersPromises = users.map(async (user) => {
      await User.create(user, {include: [Aliase.OFFERS, Aliase.COMMENTS]});
    });

    const offersPromises = offers.map(async (offer) => {
      const offerModel = await Offer.create(offer, {include: [Aliase.COMMENTS]});
      await offerModel.addCategories(transformCategoriesNamesToIds(offer.category, categoryNameToIdMap));
    });

    await Promise.all(usersPromises);
    await Promise.all(offersPromises);

    logger.info(`DB was successfully filled with mock data.`);
  } catch (err) {
    logger.error(`An error occured on filling database: ${err.message}`);
    process.exit(ExitCode.ERROR);
  }
};
