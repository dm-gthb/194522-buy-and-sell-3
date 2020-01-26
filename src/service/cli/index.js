'use strict';

const help = require(`./help`);
const version = require(`./version`);
const generate = require(`./generate`);

const Cli = {
  [generate.name]: generate,
  [help.name]: help,
  [version.name]: version,
};

module.exports = {
  Cli,
};
