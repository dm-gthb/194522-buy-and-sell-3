'use strict';

const {StatusCode} = require(`../../constants`);

module.exports = (userService) => {
  return async (req, res, next) => {
    const {email, password} = req.body;

    const user = await userService.findByEmail(email);

    if (!user) {
      res.status(StatusCode.UNAUTHORIZED).send(`No user with email ${email}`);
      return;
    }

    const isPasswordMatch = await userService.checkUserPassword(password, user);

    if (!isPasswordMatch) {
      res.status(StatusCode.UNAUTHORIZED).send(`Wrong password for email ${email}`);
      return;
    }

    res.locals.user = user;
    next();
  };
};
