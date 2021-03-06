'use strict';

var _ = require('lodash'),
    defaultAssets = require('./config/assets/default'),
    fs = require('fs'),
    path = require('path');

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        env: {
            dev: {
                NODE_ENV: 'development'
            }
        },
        watch: {
            serverViews:{
                files: defaultAssets.server.views,
                options: {
                    livereload: true
                }
            },
            serverJS: {
                files: _.union(defaultAssets.server.gruntConfig, defaultAssets.server.allJS),
                // tasks: ['eslint'],
                options:{
                    livereload: true
                }
            },
            clientViews: {
                files: defaultAssets.client.views,
                options: {
                    livereload: true
                }
            },
            clientJS: {
                files: defaultAssets.client.js,
                // tasks: ['eslint'],
                options: {
                    livereload: true
                }
            },
            clientLESS: {
                files: defaultAssets.client.less,
                tasks: ['less'],
                options: {
                    livereload: true
                }
            }
        },
        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    nodeArgs: ['--debug'],
                    ext: 'js.html',
                    watch: _.union(defaultAssets.server.gruntConfig, defaultAssets.server.views, defaultAssets.server.allJS, defaultAssets.server.config)
                }
            }
        },
        concurrent: {
            default: ['nodemon', 'watch'],
            debug: ['nodemon', 'watch', 'node-inspector'],
            options: {
                logConcurrentOutput: true
            }
        },
        // eslint: {
        //     options: {},
        //     target: _.union(defaultAssets.server.gruntConfig, defaultAssets.server.allJS, defaultAssets.client.js, testAssets.tests.server, testAssets.tests.client, testAssets.tests.e2e)
        // },
        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            all: {
                src: defaultAssets.client.css
            }
        },
        ngAnnotate: {
            production: {
                files: {
                    'public/dist/application.js': defaultAssets.client.js
                }
            }
        },
        uglify: {
            production: {
                options: {
                    mangle: false
                },
                files: {
                    'public/dist/application.min.js': 'public/dist/application.js'
                }
            }
        },
        cssmin: {
            combine: {
                files: {
                    'public/dist/application.min.css': defaultAssets.client.css
                }
            }
        },
        sass: {
            dist: {
                files: [{
                    expand: true,
                    src: defaultAssets.client.sass,
                    ext: '.css',
                    rename: function (base, src) {
                        return src.replace('/scss/', '/css/');
                    }
                }]
            }
        },
        less: {
            dist: {
                files: [{
                    expand: true,
                    src: defaultAssets.client.less,
                    ext: '.css',
                    rename: function (base, src) {
                        return src.replace('/less/', '/css/');
                    }
                }]
            }
        },
        'node-inspector':{
            custom: {
                'web-port': 1337,
                'web-host': 'localhost',
                'debug-port': 5858,
                'save-live-edit': true,
                'no-preload': true,
                'stack-trace-limit': 50,
                'hidden': []
            }
        },
        copy: {
            localConfig: {
                src: 'config/env/local.example.js',
                dest: 'config/env/local-development.js',
                filter: function () {
                    return !fs.existsSync('config/env/local-development.js');
                }
            }
        }
    });

    require('load-grunt-tasks')(grunt);


    // Make sure upload directory exists
    grunt.task.registerTask('mkdir:upload', 'Task that makes sure upload directory exists.', function () {
        // Get the callback
        var done = this.async();

        grunt.file.mkdir(path.normalize(__dirname + '/modules/users/client/img/profile/uploads'));

        done();
    });


    // Connect to the MongoDB instance and load the models
    grunt.task.registerTask('mongoose', 'Task that connects to the MongoDB instance and loads the application models.', function () {
        // Get the callback
        var done = this.async();

        // Use mongoose configuration
        var mongoose = require('./config/lib/mongoose.js');

        // Connect to database
        mongoose.connect(function (db) {
            done();
        });
    });


    // Drops the MongoDB database, used in e2e testing
    grunt.task.registerTask('dropdb', 'drop the database', function () {
        // async mode
        var done = this.async();

        // Use mongoose configuration
        var mongoose = require('./config/lib/mongoose.js');

        mongoose.connect(function (db) {
            db.connection.db.dropDatabase(function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Successfully dropped db: ', db.connection.db.databaseName);
                }
                db.connection.db.close(done);
            });
        });
    });


    grunt.task.registerTask('server', 'Starting the server', function () {
        // Get the callback
        var done = this.async();

        var path = require('path');
        var app = require(path.resolve('./config/lib/app'));
        var server = app.start(function () {
            done();
        });
    });

    grunt.registerTask('lint', ['less']);

    // Run the project in development mode
    grunt.registerTask('default', ['env:dev', 'lint', 'mkdir:upload', 'copy:localConfig', 'concurrent:default']);

    // Run the project in debug mode
    grunt.registerTask('debug', ['env:dev',  'mkdir:upload', 'copy:localConfig', 'concurrent:debug']);
};