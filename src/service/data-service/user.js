'use strict';

const passwordUtils = require(`../lib/password`);

class User {
  constructor(sequelize) {
    this._sequelize = sequelize;
    this._User = sequelize.models.User;
  }

  async createUser(data) {
    const user = await this._User.create(data);
    return user.get();
  }

  async findByEmail(email) {
    const user = await this._User.findOne({
      where: {email}
    });

    return user ? user.get() : null;
  }

  async checkUserPassword(password, userDbData) {
    const isPasswordMatch = await passwordUtils.compare(password, userDbData.passwordHash);
    return isPasswordMatch;
  }
}

module.exports = User;
