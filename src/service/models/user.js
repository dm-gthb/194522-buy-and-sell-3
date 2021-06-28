'use strict';

const {Model, DataTypes} = require(`sequelize`);

class User extends Model {}

module.exports = (sequelize) => User.init({
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: `User`,
  tableName: `users`
});
