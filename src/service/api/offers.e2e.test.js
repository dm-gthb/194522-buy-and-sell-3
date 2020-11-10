'use strict';

const express = require(`express`);
const request = require(`supertest`);
const offers = require(`./offers`);
const {OfferService, CommentService} = require(`../data-service`);
const {StatusCode} = require(`../../constants`);
const mockData = [{"id": `pCxs5n`, "category": [`Игры`], "description": `Даю недельную гарантию. Если товар не понравится — верну всё до последней копейки. Товар в отличном состоянии.\` Бонусом отдам все аксессуары.`, "picture": `item09.jpg`, "title": `Продам новую приставку Sony Playstation 5`, "type": `sale`, "sum": 50093, "comments": [{"id": `8OOAlh`, "text": `Вы что?! В магазине дешевле. Оплата наличными или перевод на карту?`}, {"id": `VCHsO6`, "text": `Неплохо, но дорого. Вы что?! В магазине дешевле.`}, {"id": `BoqJr6`, "text": `Почему в таком ужасном состоянии? Продаю в связи с переездом. Отрываю от сердца. А сколько игр в комплекте?`}]}, {"id": `XW1f8O`, "category": [`Книги`], "description": `Таких предложений больше нет! Даю недельную гарантию. При покупке с меня бесплатная доставка в черте города. Пользовались бережно и только по большим праздникам.`, "picture": `item11.jpg`, "title": `Продам новую приставку Sony Playstation 5`, "type": `offer`, "sum": 75307, "comments": [{"id": `OS8Sxo`, "text": `Неплохо, но дорого. Вы что?! В магазине дешевле. Оплата наличными или перевод на карту?`}]}, {"id": `7qUqt9`, "category": [`Игры`], "description": `Продаю с болью в сердце... Это настоящая находка для коллекционера! Даю недельную гарантию. Если найдёте дешевле — сброшу цену.`, "picture": `item00.jpg`, "title": `Продам новую приставку Sony Playstation 5`, "type": `offer`, "sum": 54749, "comments": [{"id": `3FCrro`, "text": `Совсем немного...`}]}, {"id": `5Rwmdf`, "category": [`Разное`], "description": `Пользовались бережно и только по большим праздникам. При покупке с меня бесплатная доставка в черте города. Таких предложений больше нет! Это настоящая находка для коллекционера!`, "picture": `item11.jpg`, "title": `Куплю антиквариат`, "type": `offer`, "sum": 15245, "comments": [{"id": `78ShKl`, "text": `С чем связана продажа? Почему так дешёво? А где блок питания?`}, {"id": `x8g73y`, "text": `Оплата наличными или перевод на карту?`}, {"id": `p2myYy`, "text": `Почему в таком ужасном состоянии? Вы что?! В магазине дешевле. Совсем немного...`}]}, {"id": `C_Z6RL`, "category": [`Игры`], "description": `Если товар не понравится — верну всё до последней копейки. Даю недельную гарантию. При покупке с меня бесплатная доставка в черте города. Товар в отличном состоянии.\``, "picture": `item02.jpg`, "title": `Продам новую приставку Sony Playstation 5`, "type": `offer`, "sum": 3702, "comments": [{"id": `xXfNER`, "text": `С чем связана продажа? Почему так дешёво? А где блок питания? Оплата наличными или перевод на карту?`}]}];

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  offers(app, new OfferService(cloneData), new CommentService());
  return app;
};

describe(`API returns list of all offers`, () => {
  const app = createAPI();
  let response;
  beforeAll(async () => {
    response = await request(app)
      .get(`/offers`);
  });

  test(`Returns statusCode 200`, () => expect(response.statusCode).toBe(StatusCode.OK));
  test(`Returns a list of 5 offers`, () => expect(response.body.length).toBe(5));
  test(`First offer's id is "pCxs5n"`, () => expect(response.body[0].id).toBe(`pCxs5n`));
});

describe(`API returns an offer with given id`, () => {
  const app = createAPI();
  let response;
  beforeAll(async () => {
    response = await request(app)
      .get(`/offers/pCxs5n`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCode.OK));
  test(`Offer's title is "Продам новую приставку Sony Playstation 5"`, () => expect(response.body.title).toBe(`Продам новую приставку Sony Playstation 5`));
});

describe(`API creates an offer if data is valid`, () => {
  const app = createAPI();
  let response;
  const newOffer = {
    category: `Разное`,
    description: `Описание`,
    picture: `mock.png`,
    title: `Загловок`,
    type: `sale`,
    sum: 10000,
  };

  beforeAll(async () => {
    response = await request(app)
      .post(`/offers`)
      .send(newOffer);
  });

  test(`Returns statusCode 201`, () => expect(response.statusCode).toBe(StatusCode.CREATED));
  test(`Returns created offer`, () => expect(response.body).toEqual(expect.objectContaining(newOffer)));
  test(`Offers quantity increases by 1`, () => request(app)
    .get(`/offers`)
    .expect((res) => expect(res.body.length).toBe(6))
  );
});

describe(`API refuses to create an offer if data is invalid`, () => {
  const app = createAPI();
  const newOffer = {
    category: `Разное`,
    description: `Описание`,
    picture: `mock.png`,
    title: `Загловок`,
    type: `sale`,
    sum: 10000,
  };

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newOffer)) {
      const badOffer = {...newOffer};
      delete badOffer[key];
      await request(app)
        .post(`/offers`)
        .send(badOffer)
        .expect(StatusCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent offer`, () => {
  let response;
  const app = createAPI();
  const newOffer = {
    category: `Разное`,
    description: `Описание`,
    picture: `mock.png`,
    title: `Загловок`,
    type: `sale`,
    sum: 10000,
  };

  beforeAll(async () => {
    response = await request(app)
      .put(`/offers/pCxs5n`)
      .send(newOffer);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCode.OK));
  test(`Returns changed offer`, () => expect(response.body).toEqual(expect.objectContaining(newOffer)));
  test(`Offer is changed`, () => request(app)
    .get(`/offers/pCxs5n`)
    .expect((res) => expect(res.body.title).toBe(`Загловок`))
  );
});

test(`Returns 404 for trying to change non-existent offer`, () => {
  const validOffer = {
    category: `Разное`,
    description: `Описание`,
    picture: `mock.png`,
    title: `Загловок`,
    type: `sale`,
    sum: 10000,
  };

  return request(createAPI())
    .put(`/offers/asdf`)
    .send(validOffer)
    .expect(StatusCode.NOT_FOUND);
});

test(`Returns 400 when invalid data is using to change offer`, () => {
  const invalidOffer = {
    title: `Загловок`,
    sum: 10000,
  };

  return request(createAPI())
    .put(`/offers/pCxs5n`)
    .send(invalidOffer)
    .expect(StatusCode.BAD_REQUEST);
});

describe(`API correctly deletes an offer`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/offers/pCxs5n`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCode.OK));
  test(`Returns deleted offer`, () => expect(response.body.id).toBe(`pCxs5n`));
  test(`Offer count decreased by 1`, () => request(app)
    .get(`/offers`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});

test(`API refuses to delete non-existent offer`, () => {
  const app = createAPI();
  return request(app)
    .delete(`/offers/asdf`)
    .expect(StatusCode.NOT_FOUND);
});

describe(`API returns a list of comments to given offer`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/offers/pCxs5n/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCode.OK));
  test(`Returns list of 4 comments`, () => expect(response.body.length).toBe(3));
  test(`First comment's id is "pCxs5n"`, () => expect(response.body[0].id).toBe(`8OOAlh`));

});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `Валидному комментарию достаточно этого поля`
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/offers/pCxs5n/comments`)
      .send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(StatusCode.CREATED));
  test(`Returns comment created`, () => expect(response.body).toEqual(expect.objectContaining(newComment)));
  test(`Comments count is changed`, () => request(app)
    .get(`/offers/pCxs5n/comments`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});

test(`API refuses to create a comment to non-existent offer and returns status code 404`, () => {
  const app = createAPI();
  return request(app)
    .post(`/offers/NOEXST/comments`)
    .send({
      text: `Неважно`
    })
    .expect(StatusCode.NOT_FOUND);
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, () => {
  const app = createAPI();
  return request(app)
    .post(`/offers/pCxs5n/comments`)
    .send({})
    .expect(StatusCode.BAD_REQUEST);
});

describe(`API correctly deletes a comment`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/offers/pCxs5n/comments/8OOAlh`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCode.OK));
  test(`Returns comment deleted`, () => expect(response.body.id).toBe(`8OOAlh`));
  test(`Comments count decreased by 1`, () => request(app)
    .get(`/offers/pCxs5n/comments`)
    .expect((res) => expect(res.body.length).toBe(2))
  );
});

test(`API refuses to delete non-existent comment`, () => {
  const app = createAPI();
  return request(app)
    .delete(`/offers/GxdTgz/comments/NOEXST`)
    .expect(StatusCode.NOT_FOUND);
});

test(`API refuses to delete a comment to non-existent offer`, () => {
  const app = createAPI();
  return request(app)
    .delete(`/offers/NOEXST/comments/8OOAlh`)
    .expect(StatusCode.NOT_FOUND);
});
