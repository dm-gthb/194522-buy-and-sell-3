'use strict';

const fs = require(`fs`).promises;
const {getLogger} = require(`./logger`);

const FILE_NAME = `mocks.json`;
const logger = getLogger({name: `mock`});
let data = [];

const getMockData = async () => {
  if (data.length) {
    return data;
  }

  try {
    const fileContent = await fs.readFile(FILE_NAME);
    data = JSON.parse(fileContent);
  } catch (err) {
    logger.error(err);
  }

  return data;
};

module.exports = getMockData;
