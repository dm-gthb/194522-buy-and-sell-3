'use strict';

const ExitCode = require(`../../constants`);
const {getLogger} = require(`./logger`);

const logger = getLogger();

module.exports = async (sequelize) => {
  try {
    logger.info(`Trying to connect to database...`);
    await sequelize.authenticate();
    logger.info(`Successful connection to database`);
  } catch (err) {
    logger.error(`An error occured on connecting to database: ${err.message}`);
    process.exit(ExitCode.ERROR);
  }
};
