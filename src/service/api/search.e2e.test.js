'use strict';

const express = require(`express`);
const Sequelize = require(`sequelize`);
const request = require(`supertest`);
const search = require(`./search`);
const SearchService = require(`../data-service/search`);
const {StatusCode} = require(`../../constants`);
const initDb = require(`../lib/init-db`);

const mockCategories = [
  `Журналы`,
  `Игры`,
  `Животные`
];

const mockOffers = [
  {
    "category": [
      `Игры`,
      `Журналы`
    ],
    "comments": [
      {
        "text": `С чем связана продажа? Почему так дешёво? Неплохо, но дорого. А где блок питания?`
      },
      {
        "text": `А где блок питания?`
      },
      {
        "text": `Оплата наличными или перевод на карту? Неплохо, но дорого. Почему в таком ужасном состоянии?`
      }
    ],
    "description": `Бонусом отдам все аксессуары. Если товар не понравится — верну всё до последней копейки. Товар в отличном состоянии. Это настоящая находка для коллекционера!`,
    "picture": `item13.jpg`,
    "title": `Куплю антиквариат`,
    "type": `OFFER`,
    "sum": 10030
  },
];

const app = express();
app.use(express.json());

const mockDb = new Sequelize(`sqlite::memory:`, {logging: false});

beforeAll(async () => {
  await initDb(mockDb, {categories: mockCategories, offers: mockOffers, users: []});
  search(app, new SearchService(mockDb));
});

describe(`API returns offer based on search query`, () => {
  let response;
  beforeAll(async () => {
    response = await request(app)
      .get(`/search`)
      .query({
        query: `Куплю антиквариат`
      });
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCode.OK));
  test(`One offer found`, () => expect(response.body.length).toBe(1));
  test(`Offer has correct title`, () => expect(response.body[0].title).toBe(`Куплю антиквариат`));
});

test(`API returns code 404 if nothing is found`, async () => {
  await request(app).get(`/search`).query({
    query: `Asdf`
  })
  .expect(StatusCode.NOT_FOUND);
});

test(`API returns 400 without query string`, async () => {
  await request(app)
    .get(`/search`)
    .expect(StatusCode.BAD_REQUEST);
});
