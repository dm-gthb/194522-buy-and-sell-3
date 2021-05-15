'use strict';

const sequelize = require(`../lib/sequelize`);
const connectDatabase = require(`../lib/connect-db`);
const initDatabase = require(`../lib/init-db`);
const {getLogger} = require(`../lib/logger`);
const {generateData} = require(`./generate-mock-data`);

const logger = getLogger();

module.exports = {
  name: `--filldb`,
  async run(args) {
    await connectDatabase(sequelize, logger);
    const [mocksQuantity] = args;
    try {
      const dbData = await generateData(mocksQuantity);
      await initDatabase(sequelize, dbData, logger);
    } catch (err) {
      logger.error(err);
    }
  }
};
