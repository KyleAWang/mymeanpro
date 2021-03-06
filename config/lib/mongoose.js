'use strict'
var config = require('../config'),
    chalk = require('chalk'),
    path = require('path'),
    mongoose = require('mongoose');


// Load the mongoose models
module.exports.loadModels = function (callback) {
    // Globbing model files
    config.files.server.models.forEach(function (modelPath) {
        require(path.resolve(modelPath));
    });

    if (callback) callback();
};

module.exports.connect = function (cb) {
    var _this = this;
    var db = mongoose.connect(config.db.uri, config.db.options, function (err) {
        if (err){
            console.error(chalk.red('Could not connect to MongoDB!'));
            console.log(err);
        }else{
            mongoose.set('debug', config.db.debug);
            
            if(cb) cb(db);
        }
    })
};

module.exports.disconnect = function (cb) {
    mongoose.disconnect(function (err) {
        console.info(chalk.yellow('Disconnected from MongoDB'))
    })
};