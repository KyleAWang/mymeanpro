'use strict';

module.exports = function (app) {
  // Root routing
  var core = require('../controllers/core.server.controller');

  // Define application route
  app.route('/*').get(core.renderIndex);

};
