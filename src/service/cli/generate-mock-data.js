'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const {nanoid} = require(`nanoid`);
const {getRandomInt, shuffleArray} = require(`../../utils`);
const {MAX_ID_LENGTH, ExitCode} = require(`../../constants`);

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const DEFAULT_MOCKS_QUANTITY = 1;
const MAX_MOCKS_QUANTITY = 1000;
const MIN_CATEGORIES_QUANTITY = 1;

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

const DescriptionSentencesCount = {
  MIN: 1,
  MAX: 5,
};

const CommentsCount = {
  MIN: 1,
  MAX: 3,
};

const CommentsSentencesCount = {
  MIN: 1,
  MAX: 3,
};

const mockUsers = [
  {
    email: `ivanov@example.com`,
    passwordHash: `asdfasdfasdf`,
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar1.jpg`
  },
  {
    email: `petrov@example.com`,
    passwordHash: `qwerqwer`,
    firstName: `Пётр`,
    lastName: `Петров`,
    avatar: `avatar2.jpg`
  }
];

const addId = () => ({id: nanoid(MAX_ID_LENGTH)});
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

const generate = async (count, isIds = false) => {
  const offersQuantity = parseInt(count, 10) || DEFAULT_MOCKS_QUANTITY;
  if (offersQuantity > MAX_MOCKS_QUANTITY) {
    console.error(chalk.red(`${MAX_MOCKS_QUANTITY} max`));
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
        userId: getRandomInt(1, mockUsers.length),
        category: shuffleArray(categories).slice(0, getRandomInt(MIN_CATEGORIES_QUANTITY, categories.length - 1)),
        description: shuffleArray(sentences).slice(DescriptionSentencesCount.MIN, DescriptionSentencesCount.MAX).join(` `),
        picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
        title: titles[getRandomInt(0, titles.length - 1)],
        type: Object.values(OfferType)[Math.floor(Math.random() * Object.values(OfferType).length)],
        sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
        comments: Array(getRandomInt(CommentsCount.MIN, CommentsCount.MAX)).fill({}).map(() => {
          return {
            userId: getRandomInt(1, mockUsers.length),
            text: shuffleArray(comments)
              .slice(0, getRandomInt(CommentsSentencesCount.MIN, CommentsSentencesCount.MAX))
              .join(` `),
            ...(isIds && addId())
          };
        }),
        ...(isIds && addId())
      };
    });

    return {
      users: [...mockUsers],
      offers,
      categories,
    };
  } catch (err) {
    return console.error(chalk.red(err));
  }
};

const generateData = async (count) => generate(count);
const generateDataWithIds = async (count) => generate(count, true);

module.exports = {
  generateData,
  generateDataWithIds,
};
