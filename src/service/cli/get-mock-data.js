'use strict';

const fs = require(`fs`).promises;
const {nanoid} = require(`nanoid`);
const {getRandomInt, shuffleArray} = require(`../../utils`);
const {getLogger} = require(`../lib/logger`);
const {MAX_ID_LENGTH, ExitCode} = require(`../../constants`);

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const MAX_COMMENTS_QUANTITY = 3;
const MAX_COMMENTS_SENTENCES_QUANTITY = 3;
const DEFAULT_MOCKS_QUANTITY = 1;
const MAX_MOCKS_QUANTITY = 1000;

const OfferType = {
  OFFER: `offer`,
  SALE: `sale`,
};

const SumRestrict = {
  MIN: 1000,
  MAX: 100000,
};

const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

const logger = getLogger({});

const addId = () => ({id: nanoid(MAX_ID_LENGTH)});
const getPictureFileName = (number) => number > 10 ? `item${number}.jpg` : `item0${number}.jpg`;

const readFile = async (path) => {
  try {
    const content = await fs.readFile(path, `utf-8`);
    return content.trim().split(`\n`);
  } catch (err) {
    logger.error(err);
    return [];
  }
};

const generate = async (count, isIds = false) => {
  const offersQuantity = parseInt(count, 10) || DEFAULT_MOCKS_QUANTITY;
  if (offersQuantity > MAX_MOCKS_QUANTITY) {
    logger.info(`${MAX_MOCKS_QUANTITY} max`);
    process.exit(ExitCode.ERROR);
  }

  try {
    const [categories, sentences, titles, comments] = await Promise.all([
      readFile(FILE_CATEGORIES_PATH),
      readFile(FILE_SENTENCES_PATH),
      readFile(FILE_TITLES_PATH),
      readFile(FILE_COMMENTS_PATH),
    ]);

    const offers = Array(offersQuantity).fill({}).map(() => {
      return {
        category: [categories[getRandomInt(0, categories.length - 1)]],
        description: shuffleArray(sentences).slice(1, 5).join(` `),
        picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
        title: titles[getRandomInt(0, titles.length - 1)],
        type: Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
        sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
        comments: Array(getRandomInt(1, MAX_COMMENTS_QUANTITY)).fill({}).map(() => {
          return {
            text: shuffleArray(comments)
              .slice(0, getRandomInt(1, MAX_COMMENTS_SENTENCES_QUANTITY))
              .join(` `),
            ...(isIds && addId())
          };
        }),
        ...(isIds && addId())
      };
    });

    return {
      offers,
      categories
    };
  } catch (err) {
    return logger.error(err);
  }
};

const generateData = async (count) => generate(count);
const generateDataWithIds = async (count) => generate(count, true);

module.exports = {
  generateData,
  generateDataWithIds,
};
