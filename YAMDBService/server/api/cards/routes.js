// query api
const API = require('./api');
const scryfallCard = require('../../schemas/scryfallCard');

module.exports = [
  {
    method: 'GET',
    path: '',
    options: {
      tags: ['card']
    },
    handler: (request, h) => {
      const query = request.query;
      return scryfallCard.filterAndSortSingleField(query);
    }
  },
  {
    method: 'GET',
    path: 'id/{scryfallId}',
    options: {
      tags: ['card']
    },
    handler: (request, h) => {
      const params = request.params;
      return API.getCardDataById(params.scryfallId);
    }
  },
  {
    method: 'GET',
    path: '{start}',
    options: {
      tags: ['card']
    },
    handler: (request, h) => {
      const query = request.query;
      const params = request.params;
      return scryfallCard.filterAndSortSingleField(query, null, null, params.start);
    }
  },
  {
    method: 'GET',
    path: '{start}/{end}',
    options: {
      tags: ['card']
    },
    handler: (request, h) => {
      const query = request.query;
      const params = request.params;
      return scryfallCard.filterAndSortSingleField(query, null, null, params.start, params.end);
    }
  },
  {
    method: 'GET',
    path: 'orderby/{field}/{dir}/{start}',
    options: {
      tags: ['card']
    },
    handler: (request, h) => {
      const query = request.query;
      const params = request.params;
      return scryfallCard.filterAndSortSingleField(query, params.field, params.dir, params.start);
    }
  },
  {
    method: 'GET',
    path: 'orderby/{field}/{dir}/{start}/{end}',
    options: {
      tags: ['card']
    },
    handler: (request, h) => {
      const query = request.query;
      const params = request.params;
      return scryfallCard.filterAndSortSingleField(query, params.field, params.dir, params.start, params.end);
    }
  }
]