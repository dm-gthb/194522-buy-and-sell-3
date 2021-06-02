'use strict';

module.exports = {
  DEFAULT_COMMAND: `--help`,
  USER_ARGV_INDEX: 2,
  API_PREFIX: `/api`,
  MAX_ID_LENGTH: 6,
  OFFERS_PER_PAGE: 8,
  ExitCode: {
    ERROR: 1,
    SUCCESS: 0,
  },
  StatusCode: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
  },
  Env: {
    DEVELOPMENT: `development`,
    PRODUCTION: `production`
  }
};
