const direction = {
  asc: 1,
  desc: -1
};

const convertQueryToFilter = (query) => {
  for (field in query) {
    // treat name fields as text search.
    if (field.includes('name') || field.includes('type')) {
      query[field] = { $regex: query[field], $options: 'i' };
    }
  }
  query['set'] = {'$ne':null};
  query['image_uris'] = {'$ne':null};
  query['lang'] = 'en';
  query['multiverse_ids'] = { '$exists': true, '$ne': [] };
  return query;
};

const queryWithPage = function (context, query = {}, sort = {}, start = 1, end = 50) {
  return context.paginate(convertQueryToFilter(query), { select: '-_id', sort, offset: start - 1, limit: start ? (end - start + 1) : end });
};

// TODO :: Headstart on getting a distinct aggregate query to work but it's not quite there.
// It does the distinct select, sort, and limit, but I don't have time to finish this up to get a normalized doc with a properly formatted response.

const convertQueryToAggregate = (query) => {
  let aggregateQuery = {};
  for (field in query) {
    // treat name fields as text search.
    if (field.includes('name')) {
      aggregateQuery = {
        '$match': {}
      };
      aggregateQuery['$match'][field] = { '$regex': query[field], '$options': 'i' };
    } else {
      aggregateQuery = {
        '$match': {}
      };
      aggregateQuery['$match'][field] = query[field];
    }
  }
  return aggregateQuery;
};
const convertSortToAggregate = (sort) => {
  const aggregateSort = {};
  for (field in sort) {
    // add docs
    newSort[`docs.${field}`] = sort[field];
  }
  if(Object.keys(aggregateSort).length > 0) {
    return { "$sort": aggregateSort };
  }
}
const queryWithAggregate = async function (context, query = {}, sort = {}, start = 1, end = 50, distinct) {
  const aggregateSort = convertSortToAggregate(sort);
  const aggregate = [];
  aggregate.push(convertQueryToAggregate(query));
  aggregate.push({ "$group": { "_id": `$${distinct}`, "docs": { "$push": "$$ROOT" } } });
  if(aggregateSort){
    aggregateSort.push(aggregateSort);
  }
  aggregate.push({ "$skip": (start - 1) });
  aggregate.push({ "$limit": (start ? (end - start + 1) : end) });
  aggregate.push({ "$project": { "_id": 0, "docs": { "$slice": ["$docs", 1] } } });

  console.log(JSON.stringify(aggregate, null, 2));
  try {
  var thinger = await context.aggregate(aggregate).exec().reduce();
  return thinger;
  } catch(ex) {
    console.log(ex);
    return 'NO GOOD'
  }
};

module.exports = {
  direction,
  queryWithPage,
  convertQueryToFilter
};
