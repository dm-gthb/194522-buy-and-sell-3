'use strict';

const expressSession = require(`express-session`);
const SequelizeStore = require(`connect-session-sequelize`)(expressSession.Store);

module.exports = (sequelize) => {
  const {SESSION_SECRET} = process.env;

  if (!SESSION_SECRET) {
    throw new Error(`SESSION_SECRET environment variable is not defined`);
  }

  const MILISECONDS_IN_MINUTE = 60000;

  return expressSession({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    store: new SequelizeStore({
      db: sequelize,
      expiration: MILISECONDS_IN_MINUTE * 100,
      checkExpirationInterval: MILISECONDS_IN_MINUTE * 1,
    })
  });
};
