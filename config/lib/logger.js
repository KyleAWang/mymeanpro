'use strict'

var _ = require('lodash'),
    config = require('../config'),
    chalk = require('chalk'),
    fs = require('fs'),
    winston = require('winston');

var validFormats = ['combined', 'common', 'dev', 'tiny'];

var logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            level: 'info',
            colorize: true,
            showLevel: true,
            handleException: true,
            humanReadableUnhandleException: true
        })
    ],
    exitOnError: false
});

logger.stream = {
    write: function (msg) {
        logger.info(msg);
    }
};

logger.setupFileLogger = function setupFileLogger(options) {
    var fileLoggerTransport = this.getLogOptions();
    if (!fileLoggerTransport) {
        return false;
    }

    try {
        if (fs.openSync(fileLoggerTransport.filename, 'a+')) {
            logger.add(winston.transports.File, fileLoggerTransport);
        }
        return true;
    } catch (err) {
        console.log();
        console.log(chalk.red('An error has occured during the creation of the File transport logger.'));
        console.log(chalk.red(err));
        console.log();
    }
    return false;
}

logger.getLogOptions = function getLogOptions(configOptions) {
    var _config = _.clone(config, true);
    if (configOptions) {
        _config = configOptions;
    }

    var configFileLogger = _config.log.fileLogger;

    if (!_.has(_config, 'log.fileLogger.directoryPath') || !_.has(_config, 'log.fileLogger.fileName')) {
        console.log('unable to find logging file configuration');
        return false;
    }

    var logPath = configFileLogger.directoryPath + '/' + configFileLogger.fileName;

    return {
        level: 'debug',
        colorize: true,
        filename: logPath,
        timestamp: true,
        maxsize: configFileLogger.maxsize ? configFileLogger.maxsize : 10485760,
        maxFiles: configFileLogger.maxFiles ? configFileLogger.maxFiles : 2,
        json: (_.has(configFileLogger, 'json')) ? configFileLogger.json : false,
        eol: '\n',
        tailable: true,
        showLevel: true,
        handleExceptions: true,
        humanReadableUnhandledException: true
    }
};

logger.getMorganOptions = function getMorganOptions() {

    return {
        stream: logger.stream
    };

};


logger.getLogFormat = function getLogFormat() {
    var format = config.log && config.log.format ? config.log.format.toString() : 'combined';

    // make sure we have a valid format
    if (!_.includes(validFormats, format)) {
        format = 'combined';

        console.log();
        console.log(chalk.yellow('Warning: An invalid format was provided. The logger will use the default format of "' + format + '"'));
        console.log();
    }

    return format;
};

logger.setupFileLogger({});

module.exports = logger;
