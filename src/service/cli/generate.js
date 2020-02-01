'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const {getRandomInt, shuffleArray} = require(`../../utils`);
const {ExitCode} = require(`../../constants`);
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;

const DEFAULT_MOCKS_QUANTITY = 1;
const MAX_MOCKS_QUANTITY = 1000;
const FILE_NAME = `mocks.json`;

const OfferType = {
  offer: `offer`,
  sale: `sale`,
};

const SumRestrict = {
  min: 1000,
  max: 100000,
};

const PictureRestrict = {
  min: 0,
  max: 16,
};

const getPictureFileName = (number) => number > 10 ? `item${number}.jpg` : `item0${number}.jpg`;

const readFile = async (path) => {
  try {
    const content = await fs.readFile(path, `utf-8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generateOffers = (count, categories, sentences, titles) => (
  Array(count).fill({}).map(() => ({
    category: [categories[getRandomInt(0, categories.length - 1)]],
    description: shuffleArray(sentences).slice(1, 5).join(` `),
    picture: getPictureFileName(getRandomInt(PictureRestrict.min, PictureRestrict.max)),
    title: titles[getRandomInt(0, titles.length - 1)],
    type: Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
    sum: getRandomInt(SumRestrict.min, SumRestrict.max),
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const [userMocksQuantity] = args;
    const offersQuantity = parseInt(userMocksQuantity, 10) || DEFAULT_MOCKS_QUANTITY;
    if (offersQuantity > MAX_MOCKS_QUANTITY) {
      console.info(chalk.red(`Не больше 1000 объявлений`));
      process.exit(ExitCode.error);
    }

    try {
      const generateOffersParams = await Promise.all([
        readFile(FILE_CATEGORIES_PATH),
        readFile(FILE_SENTENCES_PATH),
        readFile(FILE_TITLES_PATH),
      ]);
      const content = JSON.stringify(generateOffers(offersQuantity, ...generateOffersParams));
      fs.writeFile(FILE_NAME, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};
