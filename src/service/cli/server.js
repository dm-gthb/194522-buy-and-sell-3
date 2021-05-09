'use strict';

const express = require(`express`);
const {ExitCode, API_PREFIX, StatusCode} = require(`../../constants`);
const routes = require(`../api`);
const {getLogger} = require(`../lib/logger`);
const sequelize = require(`../lib/sequelize`);

const DEFAULT_PORT = 3000;

const app = express();
const logger = getLogger({name: `api`});

const connectToDatabase = async () => {
  try {
    logger.info(`Trying to connect to database...`);
    await sequelize.authenticate();
  } catch (err) {
    logger.error(`An error occured on database connection: ${err.message}`);
    process.exit(ExitCode.ERROR);
  }
  logger.info(`Successful connection to database`);
};

app.use(express.json());

app.use((req, res, next) => {
  logger.debug(`Request on route ${req.url}`);
  res.on(`finish`, () => {
    logger.info(`Response status code ${res.statusCode}`);
  });
  next();
});

app.use(API_PREFIX, routes);

app.use((req, res) => {
  res.status(StatusCode.NOT_FOUND).send(`Not found`);
  logger.error(`Route not found: ${req.url}`);
});

app.use((err, _req, _res, _next) => {
  logger.error(`An error occured on processing request: ${err.message}`);
});

module.exports = {
  name: `--server`,
  async run(args) {
    connectToDatabase();
    const [userPort] = args;
    const port = parseInt(userPort, 10) || DEFAULT_PORT;

    try {
      app.listen(port, (err) => {
        if (err) {
          return logger.error(`Server creation error: ${err}`);
        }
        return logger.info(`Server is running on port: ${port}`);
      });
    } catch (err) {
      logger.error(`An error occured: ${err.message}`);
      process.exit(ExitCode.ERROR);
    }
  }
};
