'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const offers = require(`./offers`);
const {OfferService, CommentService} = require(`../data-service`);
const {StatusCode} = require(`../../constants`);
const initDb = require(`../lib/init-db`);

const mockUsers = [
  {
    name: `Ivan Ivanov`,
    email: `ivan@ivan.ivan`,
    passwordHash: `123456`,
    avatar: `img.jpg`,
  },
  {
    name: `Petr Petrov`,
    email: `petr@petr.petr`,
    passwordHash: `123456`,
    avatar: `img.jpg`,
  },
];

const mockCategories = [
  `Журналы`,
  `Игры`,
  `Животные`
];

const mockOffers = [
  {
    "userId": 1,
    "categories": [
      `Игры`,
      `Журналы`
    ],
    "comments": [
      {
        "userId": 1,
        "text": `С чем связана продажа? Почему так дешёво? Неплохо, но дорого. А где блок питания?`
      },
      {
        "userId": 1,
        "text": `А где блок питания?`
      },
      {
        "userId": 1,
        "text": `Оплата наличными или перевод на карту? Неплохо, но дорого. Почему в таком ужасном состоянии?`
      }
    ],
    "description": `Бонусом отдам все аксессуары. Если товар не понравится — верну всё до последней копейки. Товар в отличном состоянии. Это настоящая находка для коллекционера!`,
    "picture": `item13.jpg`,
    "title": `Куплю антиквариат`,
    "type": `offer`,
    "sum": 10030
  },
];

const createAPI = async () => {
  const mockDb = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDb(mockDb, {categories: mockCategories, offers: mockOffers, users: mockUsers});
  const app = express();
  app.use(express.json());
  offers(app, new OfferService(mockDb), new CommentService(mockDb));
  return app;
};

describe(`API creates an offer if data is valid`, () => {
  let app;
  let response;

  const newOffer = {
    userId: 1,
    categories: [1, 2],
    description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Et sequi, culpa voluptates nostrum, ipsam eligendi iure ipsum magnam mollitia dolores ullam quaerat dolorum facere saepe soluta accusantium? Facilis sed voluptatum dolorum! Ad adipisci libero omnis vel corporis, maxime, eveniet in esse provident a neque pariatur animi nihil aspernatur. Mollitia doloremque aperiam autem quo cumque soluta tenetur temporibus! Exercitationem, ab omnis?`,
    picture: `mock.png`,
    title: `Lorem ipsum dolor sit amet`,
    type: `sale`,
    sum: 10000,
  };

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/offers`)
      .send(newOffer);
  });

  test(`Returns statusCode 201`, () => expect(response.statusCode).toBe(StatusCode.CREATED));

  test(`Offers quantity increases by 1`, () => request(app)
    .get(`/offers`)
    .expect((res) => expect(res.body.length).toBe(2))
  );

  test(`When field type is wrong response code is 400`, async () => {
    const badOffers = [
      {...newOffer, sum: true},
      {...newOffer, picture: 1},
      {...newOffer, categories: `asdf`}
    ];
    for (const badOffer of badOffers) {
      await request(app)
        .post(`/offers`)
        .send(badOffer)
        .expect(StatusCode.BAD_REQUEST);
    }
  });

  test(`When field value is wrong response code is 400`, async () => {
    const badOffers = [
      {...newOffer, sum: -1},
      {...newOffer, title: `too short`},
      {...newOffer, categories: []}
    ];
    for (const badOffer of badOffers) {
      await request(app)
        .post(`/offers`)
        .send(badOffer)
        .expect(StatusCode.BAD_REQUEST);
    }
  });
});

describe(`API returns list of all offers`, () => {
  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .get(`/offers`);
  });

  test(`Returns statusCode 200`, () => expect(response.statusCode).toBe(StatusCode.OK));
  test(`Returns a list of 1 offer`, () => expect(response.body.length).toBe(1));
  test(`First offer's title is "Куплю антиквариат"`, () => expect(response.body[0].title).toBe(`Куплю антиквариат`));
});

describe(`API returns an offer with given id`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/offers/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCode.OK));
  test(`Offer's title is "Куплю антиквариат"`, () => expect(response.body.title).toBe(`Куплю антиквариат`));
});

describe(`API refuses to create an offer if data is invalid`, () => {
  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  const newOffer = {
    userId: 1,
    categories: [1, 2],
    description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Et sequi, culpa voluptates nostrum, ipsam eligendi iure ipsum magnam mollitia dolores ullam quaerat dolorum facere saepe soluta accusantium? Facilis sed voluptatum dolorum! Ad adipisci libero omnis vel corporis, maxime, eveniet in esse provident a neque pariatur animi nihil aspernatur. Mollitia doloremque aperiam autem quo cumque soluta tenetur temporibus! Exercitationem, ab omnis?`,
    picture: `mock.png`,
    title: `Lorem ipsum dolor sit amet`,
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
  let app;

  const newOffer = {
    userId: 1,
    categories: [1, 2],
    description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Et sequi, culpa voluptates nostrum, ipsam eligendi iure ipsum magnam mollitia dolores ullam quaerat dolorum facere saepe soluta accusantium? Facilis sed voluptatum dolorum! Ad adipisci libero omnis vel corporis, maxime, eveniet in esse provident a neque pariatur animi nihil aspernatur. Mollitia doloremque aperiam autem quo cumque soluta tenetur temporibus! Exercitationem, ab omnis?`,
    picture: `mock.png`,
    title: `Lorem ipsum dolor sit amet`,
    type: `sale`,
    sum: 10000,
  };

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .put(`/offers/edit/1`)
      .send(newOffer);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCode.OK));
  test(`Offer is changed`, () => request(app)
    .get(`/offers/1`)
    .expect((res) => expect(res.body.title).toBe(`Lorem ipsum dolor sit amet`))
  );
});

test(`Returns 404 for trying to change non-existent offer`, async () => {
  const validOffer = {
    userId: 1,
    categories: [1, 2],
    description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Et sequi, culpa voluptates nostrum, ipsam eligendi iure ipsum magnam mollitia dolores ullam quaerat dolorum facere saepe soluta accusantium? Facilis sed voluptatum dolorum! Ad adipisci libero omnis vel corporis, maxime, eveniet in esse provident a neque pariatur animi nihil aspernatur. Mollitia doloremque aperiam autem quo cumque soluta tenetur temporibus! Exercitationem, ab omnis?`,
    picture: `mock.png`,
    title: `Lorem ipsum dolor sit amet`,
    type: `sale`,
    sum: 10000,
  };

  const app = await createAPI();

  return request(app)
    .put(`/offers/edit/asdf`)
    .send(validOffer)
    .expect(StatusCode.NOT_FOUND);
});

test(`Returns 400 when invalid data is using to change offer`, async () => {
  const invalidOffer = {
    title: `Lorem ipsum dolor sit amet`,
    sum: 10000,
  };

  const app = await createAPI();

  return request(app)
    .put(`/offers/edit/1`)
    .send(invalidOffer)
    .expect(StatusCode.BAD_REQUEST);
});

describe(`API correctly deletes an offer`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/offers/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCode.OK));
  test(`Offer count decreased by 1`, () => request(app)
    .get(`/offers`)
    .expect((res) => expect(res.body.length).toBe(0))
  );
});

test(`API refuses to delete non-existent offer`, async () => {
  const app = await createAPI();
  return request(app)
    .delete(`/offers/asdf`)
    .expect(StatusCode.NOT_FOUND);
});

describe(`API returns a list of comments to given offer`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .get(`/offers/1/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCode.OK));
  test(`Returns list of 4 comments`, () => expect(response.body.length).toBe(3));
  test(`First comment's text is "С чем связана продажа? Почему так дешёво? Неплохо, но дорого. А где блок питания?"`,
      () => expect(response.body[0].text).toBe(`С чем связана продажа? Почему так дешёво? Неплохо, но дорого. А где блок питания?`)
  );
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    userId: 1,
    text: `Валидному комментарию достаточно этого поля`
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/offers/1/comments`)
      .send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(StatusCode.CREATED));
  test(`Comments count is changed`, () => request(app)
    .get(`/offers/1/comments`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});

test(`API refuses to create a comment to non-existent offer and returns status code 404`, async () => {
  const app = await createAPI();
  return request(app)
    .post(`/offers/NOEXST/comments`)
    .send({
      text: `Неважно`
    })
    .expect(StatusCode.NOT_FOUND);
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, async () => {
  const app = await createAPI();
  return request(app)
    .post(`/offers/1/comments`)
    .send({})
    .expect(StatusCode.BAD_REQUEST);
});

describe(`API correctly deletes a comment`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/offers/1/comments/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCode.OK));
  test(`Comments count decreased by 1`, () => request(app)
    .get(`/offers/1/comments`)
    .expect((res) => expect(res.body.length).toBe(2))
  );
});

test(`API refuses to delete non-existent comment`, async () => {
  const app = await createAPI();
  return request(app)
    .delete(`/offers/1/comments/NOEXST`)
    .expect(StatusCode.NOT_FOUND);
});

test(`API refuses to delete a comment to non-existent offer`, async () => {
  const app = await createAPI();
  return request(app)
    .delete(`/offers/NOEXST/comments/1`)
    .expect(StatusCode.NOT_FOUND);
});
