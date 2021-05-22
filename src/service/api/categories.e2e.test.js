'use strict';

const request = require(`supertest`);
const express = require(`express`);
const Sequelize = require(`sequelize`);
const {StatusCode} = require(`../../constants`);
const categories = require(`./categories`);
const {CategoryService} = require(`../data-service`);
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

const mockDb = new Sequelize(`sqlite::memory:`, {logging: false});

const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDb(mockDb, {categories: mockCategories, offers: mockOffers, users: []});
  categories(app, new CategoryService(mockDb));
});

describe(`API returns categories list`, () => {
  let response;
  beforeAll(async () => {
    response = await request(app)
      .get(`/categories`);
  });

  test(`Status Code 200`, () => expect(response.statusCode).toBe(StatusCode.OK));
  test(`Returns 3 categories`, () => expect(response.body.length).toBe(3));
  test(`Category names are "Журналы", "Игры", "Животные"`,
      () => expect(response.body.map((category) =>category.name)).toEqual(
          expect.arrayContaining([`Журналы`, `Игры`, `Животные`])
      )
  );
});
