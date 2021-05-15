'use strict';

const sequelize = require(`../lib/sequelize`);
const connectDatabase = require(`../lib/connect-db`);
const initDatabase = require(`../lib/init-db`);
const {generateData} = require(`./generate-mock-data`);

module.exports = {
  name: `--filldb`,
  async run(args) {
    await connectDatabase(sequelize);
    const [mocksQuantity] = args;
    const dbData = await generateData(mocksQuantity);
    await initDatabase(sequelize, dbData);
  }
};
