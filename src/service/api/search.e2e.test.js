'use strict';

const express = require(`express`);
const request = require(`supertest`);
const search = require(`./search`);
const DataService = require(`../data-service/search`);
const {StatusCode} = require(`../../constants`);

const mockData = [{"id": `pCxs5n`, "category": [`Игры`], "description": `Даю недельную гарантию. Если товар не понравится — верну всё до последней копейки. Товар в отличном состоянии.\` Бонусом отдам все аксессуары.`, "picture": `item09.jpg`, "title": `Продам новую приставку Sony Playstation 5`, "type": `sale`, "sum": 50093, "comments": [{"id": `8OOAlh`, "text": `Вы что?! В магазине дешевле. Оплата наличными или перевод на карту?`}, {"id": `VCHsO6`, "text": `Неплохо, но дорого. Вы что?! В магазине дешевле.`}, {"id": `BoqJr6`, "text": `Почему в таком ужасном состоянии? Продаю в связи с переездом. Отрываю от сердца. А сколько игр в комплекте?`}]}, {"id": `XW1f8O`, "category": [`Книги`], "description": `Таких предложений больше нет! Даю недельную гарантию. При покупке с меня бесплатная доставка в черте города. Пользовались бережно и только по большим праздникам.`, "picture": `item11.jpg`, "title": `Продам новую приставку Sony Playstation 5`, "type": `offer`, "sum": 75307, "comments": [{"id": `OS8Sxo`, "text": `Неплохо, но дорого. Вы что?! В магазине дешевле. Оплата наличными или перевод на карту?`}]}, {"id": `7qUqt9`, "category": [`Игры`], "description": `Продаю с болью в сердце... Это настоящая находка для коллекционера! Даю недельную гарантию. Если найдёте дешевле — сброшу цену.`, "picture": `item00.jpg`, "title": `Продам новую приставку Sony Playstation 5`, "type": `offer`, "sum": 54749, "comments": [{"id": `3FCrro`, "text": `Совсем немного...`}]}, {"id": `5Rwmdf`, "category": [`Разное`], "description": `Пользовались бережно и только по большим праздникам. При покупке с меня бесплатная доставка в черте города. Таких предложений больше нет! Это настоящая находка для коллекционера!`, "picture": `item11.jpg`, "title": `Куплю антиквариат`, "type": `offer`, "sum": 15245, "comments": [{"id": `78ShKl`, "text": `С чем связана продажа? Почему так дешёво? А где блок питания?`}, {"id": `x8g73y`, "text": `Оплата наличными или перевод на карту?`}, {"id": `p2myYy`, "text": `Почему в таком ужасном состоянии? Вы что?! В магазине дешевле. Совсем немного...`}]}, {"id": `C_Z6RL`, "category": [`Игры`], "description": `Если товар не понравится — верну всё до последней копейки. Даю недельную гарантию. При покупке с меня бесплатная доставка в черте города. Товар в отличном состоянии.\``, "picture": `item02.jpg`, "title": `Продам новую приставку Sony Playstation 5`, "type": `offer`, "sum": 3702, "comments": [{"id": `xXfNER`, "text": `С чем связана продажа? Почему так дешёво? А где блок питания? Оплата наличными или перевод на карту?`}]}];

const app = express();
app.use(express.json());
search(app, new DataService(mockData));

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
  test(`Offer has correct id`, () => expect(response.body[0].id).toBe(`5Rwmdf`));
});

test(`API returns code 404 if nothing is found`,
    () => request(app)
      .get(`/search`)
      .query({
        query: `Asdf`
      })
      .expect(StatusCode.NOT_FOUND)
);

test(`API returns 400 without query string`,
    () => request(app)
      .get(`/search`)
      .expect(StatusCode.BAD_REQUEST)
);
