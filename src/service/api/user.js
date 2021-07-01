'use strict';

const {Router} = require(`express`);
const {StatusCode} = require(`../../constants`);
const emailValidator = require(`../middlewares/email-validator`);
const schemaValidator = require(`../middlewares/schema-validator`);
const userSchema = require(`../schemas/user`);
const userLoginSchema = require(`../schemas/user-login`);
const passwordUtils = require(`../lib/password`);
const authenticate = require(`../middlewares/authenticate`);

module.exports = (app, userService) => {
  const userRouter = new Router();

  app.use(`/user`, userRouter);

  userRouter.post(`/`, schemaValidator(userSchema), emailValidator(userService), async (req, res) => {
    const userData = req.body;
    userData.passwordHash = await passwordUtils.hash(userData.password);
    const newUser = await userService.createUser(userData);
    delete newUser.passwordHash;
    return res.status(StatusCode.CREATED).json(newUser);
  });

  userRouter.post(`/login`, schemaValidator(userLoginSchema), authenticate(userService), async (req, res) => {
    const {user} = res.locals;
    delete user.passwordHash;
    return res.status(StatusCode.OK).json(user);
  });
};
