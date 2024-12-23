const http = require('http');
const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');
const expressRoutes = require('../routes/routes.js');
const { logger } = require('../utils/logger.js');
const app = express();

const state = {
  server: null
};

async function startup() {
  app.use(bodyParser.json());
  app.use('/', expressRoutes);

  state.server = http.createServer(app);
  const port = config.get('port');

  state.server.listen(port, function() {
    logger.info(`Notification manager listening on port: ${port}`);
  });
  return { ok: true, port };
}

async function shutdownServer(server) {
  return new Promise(resolve => {
    server ? server.close(resolve) : resolve();
  });
}

async function shutdown() {
  await Promise.all([shutdownServer(state.server)]);
  logger.info('Server shutdown');
}

module.exports = {
  startup,
  shutdown
};
