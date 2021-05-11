'use strict';

const {Model, DataTypes} = require(`sequelize`);

class Offer extends Model {}

const define = (sequelize) => {
  return Offer.init({
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    picture: DataTypes.STRING,
    sum: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: `Offer`,
    tableName: `offers`
  });
};

module.exports = define;
