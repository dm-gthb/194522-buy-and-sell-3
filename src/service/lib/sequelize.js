'use strict';

const Sequelize = require(`sequelize`);
const {DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD} = process.env;

const isMissedSomeEnvVars = [DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD].some((envVar) => envVar === undefined);

if (isMissedSomeEnvVars) {
  throw new Error(`One or more env variables are not defined`);
}

const MIN_POOL_CONNECTIONS = 0;
const MAX_POOL_CONNECTIONS = 5;
const ACQUIRE_MAX_MILLISECONDS = 10000;
const IDLE_MAX_MILLISECONDS = 10000;

module.exports = new Sequelize(
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    {
      host: DB_HOST,
      port: DB_PORT,
      dialect: `postgres`,
      pool: {
        min: MIN_POOL_CONNECTIONS,
        max: MAX_POOL_CONNECTIONS,
        acquire: ACQUIRE_MAX_MILLISECONDS,
        idle: IDLE_MAX_MILLISECONDS,
      },
    },
);
