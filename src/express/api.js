'use strict';

const axios = require(`axios`);
const {HttpMethod} = require(`../constants`);

const TIMEOUT = 10000;
const port = process.env.API_PORT || 3000;
const defaultURL = `http://localhost:${port}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  getOffers({isWithComments, offset, limit}) {
    return this._load(`/offers`, {params: {isWithComments, offset, limit}});
  }

  getOffersByUser(userId) {
    return this._load(`/offers`, {params: {userId}});
  }

  getOffersByCategory(categoryId, limit, offset) {
    return this._load(`/offers`, {params: {categoryId, limit, offset}});
  }

  getOffer(id, {isWithComments}) {
    return this._load(`/offers/${id}`, {params: {isWithComments}});
  }

  editOffer(id, data) {
    return this._load(`/offers/edit/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  deleteOffer(id) {
    return this._load(`/offers/${id}`, {
      method: HttpMethod.DELETE
    });
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  getCategories(isNeedCount) {
    return this._load(`/categories`, {params: {isNeedCount}});
  }

  getCategory(id) {
    return this._load(`/categories/${id}`);
  }

  createOffer(data) {
    return this._load(`/offers`, {
      method: HttpMethod.POST,
      data
    });
  }

  createComment(offerId, data) {
    return this._load(`/offers/${offerId}/comments`, {
      method: HttpMethod.POST,
      data
    });
  }

  createUser(data) {
    return this._load(`/user`, {
      method: HttpMethod.POST,
      data
    });
  }

  authenticateUser(email, password) {
    return this._load(`/user/login`, {
      method: HttpMethod.POST,
      data: {email, password}
    });
  }
}

const defaultAPI = new API(defaultURL, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
