'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

class CommentService {
  create(offer, comment) {
    const newComment = {
      id: nanoid(MAX_ID_LENGTH),
      comment
    };
    offer.comments.push(newComment);
    return newComment;
  }

  delete(offer, commentId) {
    const commentToDelete = offer.comments.find((comment) => comment.id === commentId);
    if (!commentToDelete) {
      return null;
    }

    offer.comments = offer.comments.filter((comment) => comment.id !== commentId);
    return commentToDelete;
  }

  findAll(offer) {
    return offer.comments;
  }
}

module.exports = CommentService;
