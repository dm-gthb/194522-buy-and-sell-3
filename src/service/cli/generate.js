'use strict';

const fs = require(`fs`).promises;
const {generateDataWithIds} = require(`./get-mock-data`);
const {getLogger} = require(`../lib/logger`);

const FILE_NAME = `mocks.json`;

const logger = getLogger();

module.exports = {
  name: `--generate`,
  async run(args) {
    const [mocksQuantity] = args;
    try {
      const {offers} = await generateDataWithIds(mocksQuantity);
      const content = JSON.stringify(offers);
      await fs.writeFile(FILE_NAME, content);
      logger.info(`Operation success. File created.`);
    } catch (err) {
      logger.error(err);
    }
  }
};
