'use strict';

const ExitCode = require(`../../constants`);

module.exports = async (sequelize, logger) => {
  try {
    logger.info(`Trying to connect to database...`);
    await sequelize.authenticate();
    logger.info(`Successful connection to database`);
  } catch (err) {
    logger.error(`An error occured on connecting to database: ${err.message}`);
    process.exit(ExitCode.ERROR);
  }
};
