'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const http = require(`http`);
const {StatusCode} = require(`../../constants`);

const DEFAULT_PORT = 3000;
const FILE_NAME = `mocks.json`;
const NOT_FOUND_TEXT = `Не найдено`;

const sendResponse = (res, statusCode, markup) => {
  const template = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>Buy and sell</title>
    </head>
    <body>
      ${markup}
    </body>
    </html>`.trim();

  res.setHeader(`Content-type`, `text/html; charset=UTF-8`);
  res.statusCode = statusCode;
  res.end(template);
};

const onClientConnect = async (req, res) => {
  switch (req.url) {
    case `/`:
      try {
        const fileContent = await fs.readFile(FILE_NAME, `utf-8`);
        const markup = JSON.parse(fileContent).map((post) => `<li>${post.title}</li>`).join(``);
        sendResponse(res, StatusCode.OK, `<ul>${markup}</ul>`);
      } catch (err) {
        console.error(chalk.red(err));
        sendResponse(res, StatusCode.NOT_FOUND, NOT_FOUND_TEXT);
      }
      break;
    default:
      sendResponse(res, StatusCode.NOT_FOUND, NOT_FOUND_TEXT);
      break;
  }
};

module.exports = {
  name: `--server`,
  run(args) {
    const [userPort] = args;
    const port = parseInt(userPort, 10) || DEFAULT_PORT;
    http.createServer(onClientConnect)
      .listen(port, (err) => {
        if (err) {
          return console.error(chalk.red(`Ошибка при создании сервера: ${err}`));
        }
        return console.info(chalk.green(`Сервер запущен на ${port}`));
      });
  }
};
