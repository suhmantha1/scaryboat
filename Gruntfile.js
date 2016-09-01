var chalk;
var matchdep;
var module;

matchdep = require('matchdep');
chalk = require('chalk');

module.exports = function(grunt) {
    var buildTasks;
    var config;
    var devTasks;
    var pkg;
    var prodTasks;
    var rewrite;
    var secret;

    pkg = grunt.file.readJSON('package.json');
    config = grunt.file.readYAML('grunt.yml').config;
    secret = grunt.file.readYAML('secret.yml').secret;
    rewrite = require('connect-modrewrite');

    grunt.initConfig({
        pkg: pkg,
        ngtemplates: {
            options: {
                module: config.files.templates.module
            },
            app: {
                cwd: config.files.templates.cwd,
                src: config.files.templates.src,
                dest: config.files.templates.dest
            }
        },
        connect: {
            client: {
                options: {
                    base: 'web',
                    port: 8080,
                    hostname: '*',
                    livereload: config.liveReloadPort,
                    // http://danburzo.ro/grunt/chapters/server/
                    middleware: function(connect, options, middlewares) {
                        var rules = [];
                        // mod-rewrite behavior
                        rules = [
                            '!\\.html|\\.js|\\.css|\\.pdf|\\.mp4|\\.jp(e?)g|\\.png|\\.eot|\\.svg|\\.ttf|\\.woff|\\.woff2|\\.gif$ /index.html'
                        ];
                        // add rewrite as first item in the chain of middlewares
                        middlewares.unshift(rewrite(rules));
                        return middlewares;
                    }
                }
            }
        },
        concat: {
            scss: {
                src: config.files.scss.concat.src,
                dest: config.files.scss.concat.dest
            },
            'js-app': {
                options: {
                    sourceMap: true
                },
                src: [config.files.js.app.src, config.files.templates.dest],
                dest: config.files.js.app.dest
            },
            'js-vendor': {
                options: {
                    sourceMap: false
                },
                src: config.files.js.vendor.src,
                dest: config.files.js.vendor.dest
            }
        },
        uglify: {
            options: {
                sourceMap: true,
                sourceMapIncludeSources: true,
                banner: '/*\n' +
                '*    555  555   555555   55555555      555555   555       555          55555555  555  555  555  55555555  \n' +
                '*    555  555  5555555   55555555     55555555  555       555          55555555  555  555  555  55555555  \n' +
                '*    55!  555  !55       55!          55!  555  55!       55!          55!       55!  55!  555  55!       \n' +
                '*    !5!  5!5  !5!       !5!          !5!  5!5  !5!       !5!          !5!       !5!  !5!  5!5  !5!       \n' +
                '*    5!5  !5!  !!55!!    5!!!:!       5!5!5!5!  5!!       5!!          5!!!:!    !!5  5!5  !5!  5!!!:!    \n' +
                '*    !5!  !!!   !!5!!!   !!!!!:       !!!5!!!!  !!!       !!!          !!!!!:    !!!  !5!  !!!  !!!!!:    \n' +
                '*    !!:  !!!       !:!  !!:          !!:  !!!  !!:       !!:          !!:       !!:  :!:  !!:  !!:       \n' +
                '*    :!:  !:!      !:!   :!:          :!:  !:!   :!:       :!:         :!:       :!:   ::!!:!   :!:       \n' +
                '*    ::::: ::  :::: ::    :: ::::     ::   :::   :: ::::   :: ::::      ::        ::    ::::     :: ::::  \n' +
                '*     : :  :   :: : :    : :: ::       :   : :  : :: : :  : :: : :      :        :       :      : :: ::   \n' +
                '* \n' +
                '*    http://useallfive.com                                                                \n' +
                '*\n' +
                '*    <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> \n' +
                '*/'
            },
            'js-app': {
                src: config.files.js.app.dest,
                dest: config.files.js.app.dest
            },
            'js-vendor': {
                src: config.files.js.vendor.dest,
                dest: config.files.js.vendor.dest
            }
        },
        sass: {
            options: {
                loadPath: config.files.scss.loadPath,
                quiet: true,
                style: 'compact'
            },
            build: {
                src: config.files.scss.concat.dest,
                dest: config.files.scss.compilation.dest
            }
        },
        cssmin: {
            options: {
                sourceMap: false
            },
            target: {
                src: config.files.scss.compilation.dest,
                dest: config.files.scss.compilation.dest
            }
        },
        watch: {
            html: {
                files: ['web/index.unprocessed.html'],
                tasks: 'preprocess:dev'
            },
            livereload: {
                options: {
                    livereload: config.liveReloadPort,
                    interrupt: true
                },
                files: [
                    config.files.js.app.src,
                    config.files.scss.compilation.dest,
                    'web/**/*.html'
                ]
            },
            scss: {
                options: {
                    interrupt: true
                },
                files: config.files.scss.watch,
                tasks: ['concat:scss', 'sass']
            }
        },
        preprocess: {
            dev: {
                src: 'web/index.unprocessed.html',
                dest: 'web/index.html',
                options: {
                    context: {
                        PRODUCTION: 'false',
                        TESTING: 'true'
                    }
                }
            },
            preprod: {
                src: 'web/index.unprocessed.html',
                dest: 'web/index.html',
                options: {
                    context: {
                        PRODUCTION: 'true',
                        TESTING: 'true'
                    }
                }
            },
            build: {
                src: 'web/index.unprocessed.html',
                dest: 'web/index.html',
                options: {
                    context: {
                        PRODUCTION: 'true',
                        TESTING: 'false'
                    }
                }
            }
        },
        copy: {
            main: {
                files: [
                    {expand: true, cwd: 'web/assets/', src:['**'], dest: 'web/_build/assets/'},
                    {expand: false, src: 'web/index.html', dest: 'web/_build/index.html'},
                    {expand: false, src: 'web/_htaccess', dest: 'web/_build/_htaccess'}
                ]
            }
        },
        environments: {
            options: {
                local_path: 'web/_build'
            },
            staging: {
                options: {
                    deploy_path: secret.staging.path,
                    host: secret.staging.host,
                    username: secret.staging.username,
                    password: secret.staging.password,
                    debug: true,
                    releases_to_keep: '3',
                    after_deploy: 'cd ' + secret.staging.path + '/current/ && mv _htaccess .htaccess'
                }
            }
        }
    });

    matchdep.filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    devTasks = [
        'concat:scss',
        'sass',
        'preprocess:dev',
        'connect:client',
        'watch'
    ];
    grunt.registerTask('default', devTasks);
    buildTasks = [
        'ngtemplates:app',
        'concat:scss',
        'sass',
        'cssmin:target',
        'concat:js-app',
        'concat:js-vendor',
        'uglify',
        'preprocess:preprod',
        'connect:client',
        'watch'
    ];
    grunt.registerTask('build', buildTasks);
    prodTasks = [
        'ngtemplates:app',
        'concat:scss',
        'sass',
        'cssmin:target',
        'concat:js-app',
        'concat:js-vendor',
        'uglify',
        'preprocess:build'
    ];
    prodTasks = [
        'ngtemplates:app',
        'concat:scss',
        'sass',
        'cssmin:target',
        'concat:js-app',
        'concat:js-vendor',
        'uglify',
        'preprocess:build',
        'copy',
        'ssh_deploy:staging'
    ];
    grunt.registerTask('stage', prodTasks);
};
