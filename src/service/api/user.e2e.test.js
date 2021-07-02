'use strict';

const express = require(`express`);
const request = require(`supertest`);
const {Sequelize} = require(`sequelize`);
const initDb = require(`../lib/init-db`);
const user = require(`./user`);
const {UserService} = require(`../data-service`);
const {StatusCode} = require(`../../constants`);
const passwordUtils = require(`../lib/password`);

const mockUsers = [
  {
    name: `Ivan Ivanov`,
    email: `ivan@ivan.com`,
    passwordHash: passwordUtils.hashSync(`123456`),
    avatar: `img.jpg`,
  },
  {
    name: `Petr Petrov`,
    email: `petr@petr.com`,
    passwordHash: passwordUtils.hashSync(`123456`),
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
  const mockDb = new Sequelize(`sqlite::memory`, {logging: false});
  await initDb(mockDb, {users: mockUsers, categories: mockCategories, offers: mockOffers});
  const app = express();
  app.use(express.json());
  user(app, new UserService(mockDb));
  return app;
};

describe(`API creates new user if data is valid`, () => {
  const newUser = {
    name: `Test`,
    email: `test@test.com`,
    password: `asdfasdf`,
    passwordRepeated: `asdfasdf`,
    avatar: `asdf.jpg`,
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/user`)
      .send(newUser);
  });

  test(`returns status code "created"`, () => expect(response.statusCode).toBe(StatusCode.CREATED));
});

describe(`API refuses to create new user if data is invalid`, () => {
  let app;

  const validUserData = {
    name: `Test Name`,
    email: `asdf@asdf.com`,
    password: `asdfasdf`,
    passwordRepeated: `asdfasdf`,
    avatar: `asdf.jpg`,
  };

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`Without any required fields returns status code "bad request"`, async () => {
    for (const key of Object.keys(validUserData)) {
      const badUserData = {...validUserData};
      delete badUserData[key];
      await request(app)
        .post(`/user`)
        .send(badUserData)
        .expect(StatusCode.BAD_REQUEST);
    }
  });

  test(`When field type is wrong response code is "bad request"`, async () => {
    const badUserDataList = [
      {...validUserData, name: true},
      {...validUserData, email: 2},
    ];

    for (const badUserData of badUserDataList) {
      await request(app)
        .post(`/user`)
        .send(badUserData)
        .expect(StatusCode.BAD_REQUEST);
    }
  });

  test(`When field value is invalid returns "bad request"`, async () => {
    const badUserDataList = [
      {...validUserData, password: `short`, passwordRepeated: `short`},
      {...validUserData, email: `invalid email`},
    ];

    for (const badUserData of badUserDataList) {
      await request(app)
        .post(`/user`)
        .send(badUserData)
        .expect(StatusCode.BAD_REQUEST);
    }
  });

  test(`When password and passwordRepeated are not equal response code is "bad request"`, async () => {
    const notEqualPasswordsData = {...validUserData, passwordRepeated: `not asdfasdf`};
    await request(app)
      .post(`/user`)
      .send(notEqualPasswordsData)
      .expect(StatusCode.BAD_REQUEST);
  });

  test(`When email is already in use response code is "bad request"`, async () => {
    const busyEmailData = {...validUserData, email: `petr@petr.com`};
    await request(app)
      .post(`/user`)
      .send(busyEmailData)
      .expect(StatusCode.BAD_REQUEST);
  });
});

describe(`API authenticate user if login data is valid`, () => {
  let app;
  let response;

  const validCredentials = {
    email: `ivan@ivan.com`,
    password: `123456`,
  };

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/user/login`)
      .send(validCredentials);
  });

  test(`Returns status code 200`, () => {
    expect(response.statusCode).toBe(StatusCode.OK);
  });

  test(`User name is Ivan Ivanov`, () => {
    expect(response.body.name).toBe(`Ivan Ivanov`);
  });
});

describe(`API refuses to authenticate user if login data is not valid`, () => {
  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`Returns status code 401 UNAUTHORIZED`, async () => {
    const invalidData = {
      email: `asdfasdf@asdfasdf.com`,
      password: `asdf`
    };

    await request(app)
      .post(`/user/login`)
      .send(invalidData)
      .expect(StatusCode.UNAUTHORIZED);
  });

  test(`Returns status code 401 UNAUTHORIZED If password is wrong`, async () => {
    const wrongPasswordData = {
      email: `ivan@ivan.com`,
      password: `not 123456`
    };

    await request(app)
      .post(`/user/login`)
      .send(wrongPasswordData)
      .expect(StatusCode.UNAUTHORIZED);
  });
});
