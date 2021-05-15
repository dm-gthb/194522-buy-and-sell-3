'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const {generateDataWithIds} = require(`./generate-mock-data`);

const FILE_NAME = `mocks.json`;

module.exports = {
  name: `--generate`,
  async run(args) {
    const [mocksQuantity] = args;
    try {
      const {offers} = await generateDataWithIds(mocksQuantity);
      const content = JSON.stringify(offers);
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(err));
    }
  }
};
