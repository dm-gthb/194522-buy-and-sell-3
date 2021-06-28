'use strict';

const {Router} = require(`express`);
const {StatusCode} = require(`../../constants`);
const emailValidator = require(`../middlewares/email-validator`);
const schemaValidator = require(`../middlewares/schema-validator`);
const userSchema = require(`../schemas/user`);
const passwordUtils = require(`../lib/password`);

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
};
