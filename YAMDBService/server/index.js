console.log(process.env.NPM_CONFIG_LOGLEVEL);
const path = require('path');
require('dotenv').config({ path: process.env.NODE_ENV !== 'production' ? path.resolve(process.cwd(), '.env.development') : path.resolve(process.cwd(), '.env') });
require('./initDB');

const fs = require('fs');
const Hapi = require('@hapi/hapi');
const logger = require('./logger').child({ component: path.basename(__filename) });
const Pack = require('../package');
const API = require('./api');

const init = async () => {

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: { // explicit cors allowance for the react dev server.
        origin: ['http://localhost:3000'],
        headers: ['Authorization', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Headers', 'Access-Control-Request-Method', 'Access-Control-Request-Headers', 'Accept'],
        additionalHeaders: ['cache-control', 'x-requested-with', 'Access-Control-Request-Headers', 'Access-Control-Request-Method', 'sec-fetch-mode', 'sec-fetch-site', 'host', 'connection', 'content-type', 'referer', 'accept-encoding', 'accept-language'],
        credentials: true
      }
    }
  });

  await server.register([
    require('@hapi/inert'),
    require('@hapi/vision'),
    {
      plugin: require('hapi-swagger'),
      options: {
        info: {
          title: 'YAMDB API Documentation',
          version: Pack.version
        }
      }
    }
  ]);

  // API Routes
  server.route(API.Routes);

  // UI routes. In a production deployment these routes would be proxied by an external load balancer and hosted elsewhere like S3. I like nginx for that.

  // static resources directory
  server.route({
    method: 'GET',
    path: '/static/{file*}',
    handler: {
      directory: {
        path: 'ui/static',
        listing: false
      }
    }
  });

  // ui root
  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return h.file('ui/index.html');
    }
  });

  // ui root and catch-all
  server.route({
    method: 'GET',
    path: '/{path*}',
    handler: (request, h) => {
      //return file if one exists in /ui
      const exists = fs.existsSync(path.resolve(__dirname, `${process.env.NODE_ENV === 'production' ? '../' : ''}../ui`, request.params.path));
      if (exists) {
        return h.file(`ui/${request.params.path}`);
      }
      //return index otherwise - this lets us deep link into the SPA.
      return h.file('ui/index.html');
    }
  });

  server.events.on('response', (request) => {
    logger.info(`${request.info.remoteAddress} : ${request.method.toUpperCase()} ${request.url.pathname}${request.url.search} => ${request.response.statusCode}`);
    logger.debug(`Request Params :: ${JSON.stringify(request.params)}`);
    logger.debug(`Request Query :: ${JSON.stringify(request.query)}`);
    logger.debug(`Request Headers :: ${JSON.stringify(request.headers)}`);
    logger.debug(`Response Payload :: ${request.response._payload._data}`);
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1); // immediately flush the stack and exit.
});

init();
