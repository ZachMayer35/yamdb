const mongoose = require('mongoose');
const paginate = require('mongoose-paginate');
const generateSchema = require('generate-schema');
const utils = require('./_utils');

const Schema = mongoose.Schema;

const scryfallCardSchema = new Schema(generateSchema.mongoose(require('./scryfall_sample.json')));
scryfallCardSchema.plugin(paginate);

scryfallCardSchema.statics.filterAndSortSingleField = function (query = {}, field, dir = 'asc', start = 1, end = 20, enforceDistinctName = false) {
  let sort = {};
  if (field) {
    sort[field] = utils.direction[dir];
  }
  return enforceDistinctName ? utils.queryWithAggregate(this, query, sort, start, end, 'name') : utils.queryWithPage(this, query, sort, start, end);
};

scryfallCardSchema.statics.updateCardMetaData = function (cardMetaData) {
    // upsert
    return this.findOneAndUpdate({ id: cardMetaData.id }, cardMetaData, {
      new: true,
      upsert: true
    });
};

scryfallCardSchema.statics.findWithIds = function(idList) {
  return this.find({ id: { $in: idList } });
}

module.exports = mongoose.model('scryfall_card', scryfallCardSchema);
