'use strict';

const express = require(`express`);
const chalk = require(`chalk`);
const {ExitCode, API_PREFIX, StatusCode} = require(`../../constants`);
const getMockData = require(`../lib/get-mock-data`);
const routes = require(`../api`);

const DEFAULT_PORT = 3000;

const app = express();

app.use(express.json());
app.use(API_PREFIX, routes);
app.use((req, res) => res.status(StatusCode.NOT_FOUND).send(`Not found`));

module.exports = {
  name: `--server`,
  async run(args) {
    const [userPort] = args;
    const port = parseInt(userPort, 10) || DEFAULT_PORT;

    try {
      await getMockData();
      app.listen(port, (err) => {
        if (err) {
          return console.error(chalk.red(`Ошибка при создании сервера: ${err}`));
        }
        return console.info(chalk.green(`Сервер запущен на ${port}`));
      });
    } catch (err) {
      console.error(`Произошла ошибка: ${err.message}`);
      process.exit(ExitCode.error);
    }
  }
};
