'use strict';

const express = require(`express`);
const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const {StatusCode} = require(`../../constants`);

const DEFAULT_PORT = 3000;
const FILE_NAME = `mocks.json`;
const NOT_FOUND_TEXT = `Не найдено`;

module.exports = {
  name: `--server`,
  run(args) {
    const [userPort] = args;
    const port = parseInt(userPort, 10) || DEFAULT_PORT;
    const app = express();

    app.use(express.json());

    app.get(`/offers`, async (req, res) => {
      try {
        const fileContent = await fs.readFile(FILE_NAME, `utf-8`);
        const mock = JSON.parse(fileContent);
        res.send(mock);
      } catch (err) {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).send(err);
      }
    });

    app.use((req, res) => {
      res.status(StatusCode.NOT_FOUND).send(NOT_FOUND_TEXT);
    });

    app.listen(port, (err) => {
      if (err) {
        return console.error(chalk.red(`Ошибка при создании сервера: ${err}`));
      }
      return console.info(chalk.green(`Сервер запущен на ${port}`));
    });
  }
};
