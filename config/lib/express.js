'use strict'

var config = require('../config'),
    express = require('express'),
    morgan = require('morgan'),
    logger = require('./logger'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    favicon = require('serve-favicon'),
    compress = require('compression'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    helmet = require('helmet'),
    flash = require('connect-flash'),
    consolidate = require('consolidate'),
    path = require('path'),
    _ = require('lodash'),
    lusca = require('lusca');

module.exports.initLocalVariables = function (app) {
    app.locals.title = config.app.title;
    app.locals.description = config.app.description;
    if (config.secure && config.secure.ssl === true){
        app.locals.secure = config.secure.ssl;
    }
    app.locals.keywords = config.app.keywords;
    app.locals.googleAnalyticsTrackingID = config.app.googleAnalyticsTrackingID;
    app.locals.jsFiles = config.files.client.js;
    app.locals.cssFiles = config.files.client.css;
    app.locals.livereload = config.livereload;
    app.locals.logo = config.logo;
    app.locals.favicon = config.favicon;

    app.use(function (req, res, next) {
        res.locals.host = req.protocol + '://' + req.hostname;
        res.locals.url = req.protocol + '://' + req.headers.host + req.originalUrl;
        next();
    });
};

module.exports.initMiddleware = function (app) {
    app.set('showStackError', true);

    app.enable('jsonp callback');

    app.use(compress({
        filter: function (req, res) {
            return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
        },
        level: 9
    }));
    app.use(favicon(app.locals.favicon));

    if (_.has(config, 'log.format')){
        app.use(morgan(logger.getLogFormat(), logger.getMorganOptions()));
    }

    app.set('view cache', false);

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    app.use(cookieParser());
    app.use(flash());
};

module.exports.initViewEngine = function (app) {
    app.engine('server.view.html', consolidate[config.templateEngine]);

    app.set('view engine', 'server.view.html');
    app.set('views', './');
};

module.exports.initSession = function (app, db) {
    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret,
        cookie:{
            maxAge: config.sessionCookie.maxAge,
            httpOnly: config.sessionCookie.httpOnly,
            secure: config.sessionCookie.secure
        },
        key: config.sessionKey,
        store: new MongoStore({
            mongooseConnection: db.connection,
            collection: config.sessionCollection
        })
    }));
    app.use(lusca(config.csrf));
};

module.exports.initModulesConfiguration = function (app, db) {
    config.files.server.configs.forEach(function (configPath) {
        require(path.resolve(configPath))(app, db);
    })
};

module.exports.initHelmetHeaders = function (app) {
    var SIX_MONTHS = 15778476000;
    app.use(helmet.frameguard());
    app.use(helmet.xssFilter());
    app.use(helmet.noSniff());
    app.use(helmet.ieNoOpen());
    app.use(helmet.hsts({
        maxAge: SIX_MONTHS,
        includeSubdomains: true,
        force: true
    }));
    app.disable('x-powered-by');
};


module.exports.initModulesClientRoutes = function (app) {
    // Setting the app router and static folder
    app.use('/', express.static(path.resolve('./public')));

    // Globbing static routing
    config.folders.client.forEach(function (staticPath) {
        app.use(staticPath, express.static(path.resolve('./' + staticPath)));

    });
};


module.exports.initModulesServerPolicies = function (app) {
    // Globbing policy files
    config.files.server.policies.forEach(function (policyPath) {
        require(path.resolve(policyPath)).invokeRolesPolicies();
    });
};

module.exports.initModulesServerRoutes = function (app) {
    // Globbing routing files
    config.files.server.routes.forEach(function (routePath) {
        console.info('ktestout routepath:'+ app);
        require(path.resolve(routePath))(app);
    });
};


module.exports.initErrorRoutes = function (app) {
    app.use(function (err, req, res, next) {
        // If the error object doesn't exists
        if (!err) {
            return next();
        }

        // Log it
        console.error(err.stack);

        // Redirect to error page
        res.redirect('/server-error');
    });
};

module.exports.init = function (db) {
    var app = express();
    this.initLocalVariables(app);
    this.initMiddleware(app);
    this.initViewEngine(app);
    this.initHelmetHeaders(app);
    this.initModulesClientRoutes(app);
    this.initSession(app, db);
    this.initModulesConfiguration(app, db);
    this.initModulesServerPolicies(app);
    this.initModulesServerRoutes(app);
    this.initErrorRoutes(app);
    return app;
}
