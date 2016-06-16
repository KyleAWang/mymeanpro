/**
 * Created by Kyle on 6/13/2016.
 */
(function () {
    'use strict';

    var passport = require('passport');


    module.exports = function (app) {
        // User Routes
        var users = require('../controllers/users.server.controller');

        app.route('/api/auth/signin').post(users.signin);
        app.route('/api/auth/signup').post(users.signup);
    };

}());
 
