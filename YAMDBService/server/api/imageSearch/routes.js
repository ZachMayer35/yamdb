// query api
const API = require('./api');

module.exports = [
  {
    method: 'POST',
    path: '',
    options: {
      tags: ['card']
    },
    handler: async (request, h) => {
      const image = request.payload.image;
      return API.getCardNameFromImage(Buffer.from(image.replace(/^data:image\/png;base64,/, ""), "base64"));
    }
  }
]