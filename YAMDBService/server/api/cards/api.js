const scryfallCard = require('../../schemas/scryfallCard');
const gathererCard = require('../../schemas/gathererCard');
const axios = require('axios');

const oneDay = 60 * 60 * 24 * 1000;
const scryfallAPI = 'https://api.scryfall.com/cards/';
const gathererAPI = 'https://api.magicthegathering.io/v1/cards';

module.exports = {
  getCardDataById: async (scryfallId) => {
    try {
      // get scryfall card 
      let card = (await scryfallCard.findWithIds([scryfallId]))[0];
      // check for missing data in scryfall set (last_cached missing or > 24h) on each result
      if (!card.last_cached || (Date.now() - card.last_cached) > oneDay) {
        // query scryfall for missing data
        card = await axios.get(`${scryfallAPI}${scryfallId}`).then(res => scryfallCard.updateCardMetaData({ id: res.data.id, prices: res.data.prices, purchase_uris: res.data.purchase_uris, last_cached: Date.now() }));
      }

      // get gatherer card(s)
      //console.log(card);
      let gathererCards = await gathererCard.findByName(card.name);

      //console.log(gathererCards);
      // check for missing data in gatherer set (last_cached missing or > 24h) on each result
      if (gathererCards.length === 0) {
        // query gatherer for missing data
        gathererCards = (await axios.get(`${gathererAPI}?name=${encodeURIComponent(card.name)}`)).data.cards;
      } else {
        missingIds = [];
        gathererCards.forEach(gc => {
          if (!gc.last_cached || (Date.now() - gc.last_cached) > oneDay) {
            missingIds.push(gc.id);
          }
        });
        if (missingIds.length > 0) {
          gathererCards = (await axios.get(`${gathererAPI}?name=${encodeURIComponent(card.name)}`)).data.cards;
        }
      }
      // upsert into gatherer db - no need to wait for this
      // TODO: move this into a child process/worker thread.
      gathererCards.forEach(async gc => {
        let { _id, _v, ...thisCard} = gc._doc || gc;
        try {
          await gathererCard.updateCardMetaData({ ...thisCard, last_cached: Date.now() });
        } catch (ex) {
          // sometimes cards have weird values in otherwise straightforward fields. This at least logs when that happens.
          console.log(ex);
          console.log(JSON.stringify(thisCard, null, 2));
        }
      });

      // return combined results.
      return { ...card._doc, gathererCards };
    } catch (ex) {
      console.log(ex);
    }
  }
}