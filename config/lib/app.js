'use strict'

var config = require('../config'),
    mongoose = require('./mongoose'),
    express = require('./express'),
    chalk = require('chalk');

module.exports.loadModels = function  loadModels() {
    mongoose.loadModels();
};

mongoose.loadModels();

module.exports.init = function init(callback) {
    mongoose.connect(function (db) {
        var app = express.init(db);
        if (callback) callback(app, db, config);
    })
};

module.exports.start = function start(callback){
    var _this = this;
    _this.init(function (app, db, config) {
        console.log('ktestout:'+config.port+ config.host);
        app.listen(config.port, config.host, function () {
            var server = (process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') + config.host + ':' + config.port;

            console.log('--');
            console.log(chalk.green(config.app.title));
            console.log();
            console.log(chalk.green('Environment:     ' + process.env.NODE_ENV));
            console.log(chalk.green('Server:          ' + server));
            console.log(chalk.green('Database:        ' + config.db.uri));
            console.log(chalk.green('App version:     ' + config.meanjs.version));

            if (callback) callback(app, db, config);
        });
    });
};