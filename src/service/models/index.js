'use strict';

const {Model} = require(`sequelize`);
const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineOffer = require(`./offer`);
const defineUser = require(`./user`);
const Aliase = require(`./aliase`);

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Offer = defineOffer(sequelize);
  const User = defineUser(sequelize);

  User.hasMany(Offer, {as: Aliase.OFFERS, foreignKey: `userId`});
  Offer.belongsTo(User, {foreignKey: `userId`});

  User.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `userId`});
  Comment.belongsTo(User, {foreignKey: `userId`});

  Offer.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `offerId`});
  Comment.belongsTo(Offer, {foreignKey: `offerId`});


  class OfferCategory extends Model {}
  OfferCategory.init({}, {sequelize});

  Offer.belongsToMany(Category, {through: OfferCategory, as: Aliase.CATEGORIES});
  Category.belongsToMany(Offer, {through: OfferCategory, as: Aliase.OFFERS});
  Category.hasMany(OfferCategory, {as: Aliase.OFFER_CATEGORIES});

  return {
    Category,
    Comment,
    User,
    Offer,
    OfferCategory,
  };
};

module.exports = define;
