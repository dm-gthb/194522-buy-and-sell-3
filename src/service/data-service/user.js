'use strict';

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
}

module.exports = User;
