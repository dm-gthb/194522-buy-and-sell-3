'use strict';

const axios = require(`axios`);

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

  getOffersByCategory(categoryId) {
    return this._load(`/offers`, {params: {categoryId}});
  }

  getOffer(id, {isWithComments}) {
    return this._load(`/offers/${id}`, {params: {isWithComments}});
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  getCategories(isNeedCount) {
    return this._load(`/categories`, {params: {isNeedCount}});
  }

  createOffer(data) {
    return this._load(`/offers`, {
      method: `POST`,
      data
    });
  }
}

const defaultAPI = new API(defaultURL, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
