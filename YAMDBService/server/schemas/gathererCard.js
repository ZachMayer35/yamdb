const mongoose = require('mongoose');
const paginate = require('mongoose-paginate');
const generateSchema = require('generate-schema');
const utils = require('./_utils');

const Schema = mongoose.Schema;

const gathererCardSchema = new Schema(generateSchema.mongoose(require('./gatherer_sample.json')));
gathererCardSchema.plugin(paginate);

gathererCardSchema.statics.filterAndSortSingleField = function (query = {}, field, dir = 'asc', start = 1, end = 20) {
  let sort = {};
  if (field) {
    sort[field] = utils.direction[dir];
  }
  return utils.queryWithPage(this, query, sort, start, end);
};

gathererCardSchema.statics.updateCardMetaData = function (cardMetaData) {
  // upsert
  return this.findOneAndUpdate({ id: cardMetaData.id }, cardMetaData, {
    new: true,
    upsert: true
  });
};

gathererCardSchema.statics.findByName = function(name) {
  return this.find({ name: { $regex: name, $options: 'i' } });
}

module.exports = mongoose.model('gatherer_card', gathererCardSchema);
