'use strict';

const multer = require(`multer`);

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffleArray = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

const ensureArray = (value) => {
  if (value) {
    return Array.isArray(value) ? value : [value];
  }

  return [];
};

const createStorage = (uploadDir, uniqueName) => {
  const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const extension = file.originalname.split(`.`).pop();
      cb(null, `${uniqueName}.${extension}`);
    }
  });
  return multer({storage});
};

module.exports = {
  getRandomInt,
  shuffleArray,
  ensureArray,
  createStorage
};
