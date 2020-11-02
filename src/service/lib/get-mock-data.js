'use strict';

const fs = require(`fs`).promises;

const FILE_NAME = `mocks.json`;
let data;

const getMockData = async () => {
  if (data) {
    return Promise.resolve(data);
  }

  try {
    const fileContent = await fs.readFile(FILE_NAME);
    return Promise.resolve(JSON.parse(fileContent));
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = getMockData;
