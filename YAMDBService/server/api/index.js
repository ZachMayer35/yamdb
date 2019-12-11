const fs = require('fs');
const path = require('path');

const logger = require('../logger').child({ component: path.basename(__filename) });

// Get APIs as a function of top-level directory names in the service/api path
let apiNames = ((srcPath) => fs.readdirSync(srcPath).filter(file => fs.statSync(path.join(srcPath, file)).isDirectory()))(__dirname);

let Apis = { Routes: [] };

// Build the routes using configured base name and add tags for swagger.
apiNames.forEach((name) => {
  try {
    const api = require(`./${name}`);
    if (!api.Api || !api.Routes) {
      throw new Error();
    }
    Apis[name] = api.Api;
    let apiRoutes = api.Routes.map(r => {
      const route = {
        ...r,
        path: `/api/${name}${r.path ? `/${r.path}` : ''}`,
        options: {
          ...r.options,
          id: `api/${name}/${r.options.id || r.path}`,
          tags: [...r.options.tags, name, r.method, 'api']
        }
      };
      logger.info(`Api Route Built :: ${route.path}`);
      return route;
    });
    Apis.Routes.push(...apiRoutes);
  } catch (ex) {
    logger.info(ex);
    logger.warn(`Api '${name}' appears to be malformed. Make sure the directory has an index.js which exports an object: {Api, Routes}.`);
  }
});

module.exports = Apis;
