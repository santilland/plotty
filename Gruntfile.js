// Generated on 2013-11-22 using generator-webapp 0.4.4
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.loadNpmTasks('grunt-release');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-jsdoc');

    grunt.initConfig({
        // configurable paths
        yeoman: {
            src: 'src',
            dist: 'dist'
        },
        watch: {
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    'test/*.html',
                    '{.tmp,<%= yeoman.src %>}{,*/}*.js'
                ]
            }
        },
        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                // change this to '0.0.0.0' to access the server from outside
                hostname: '0.0.0.0'
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        'test/',
                        'src/'
                    ]
                }
            },
            test: {
                options: {
                    base: [
                        '.tmp',
                        'test',
                        '<%= yeoman.src %>'
                    ]
                }
            },
            dist: {
                options: {
                    open: true,
                    base: '<%= yeoman.dist %>',
                    livereload: false
                }
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp',
            docs: 'docs'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.src %>/{,*/}*.js',
                'test/spec/{,*/}*.js'
            ]
        },
        mocha: {
            all: {
                options: {
                    run: true,
                    urls: ['http://<%= connect.test.options.hostname %>:<%= connect.test.options.port %>/index.html']
                }
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            }
        },
        // not used since Uglify task does concat,
        // but still available if needed
        /*concat: {
            dist: {}
        },*/
        // not enabled since usemin task does concat and uglify
        // check index.html to edit your build targets
        // enable this task if you prefer defining your build targets here
        uglify: {
            options: {
                mangle: {
                    except: ['$', 'd3'],
                    toplevel: false
                }
            },
            target: {
                options: {
                    sourceMap: true,
                    sourceMapName: '<%= yeoman.dist %>/plotty.min.js.map'
                },
                files: {
                    '<%= yeoman.dist %>/plotty.min.js': ['<%= yeoman.src %>/plotty.js']
                }
            }
        },
        'bower-install': {
            app: {
                html: '<%= yeoman.src %>/index.html',
                ignorePath: '<%= yeoman.src %>/'
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/{,*/}*.js',
                        '<%= yeoman.dist %>/styles/{,*/}*.css',
                        '<%= yeoman.dist %>/images/{,*/}*.{gif,jpeg,jpg,png,webp}',
                        '<%= yeoman.dist %>/styles/fonts/{,*/}*.*'
                    ]
                }
            }
        },
        useminPrepare: {
            options: {
                dest: '<%= yeoman.dist %>'
            },
            html: '<%= yeoman.app %>/index.html'
        },
        usemin: {
            options: {
                assetsDirs: ['<%= yeoman.dist %>']
            },
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            //css: ['<%= yeoman.dist %>/styles/{,*/}*.css']
        },
        // Put files not handled in other tasks here
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.src %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                    ]
                }]
            },
            styles: {
                expand: true,
                dot: true,
                cwd: '<%= yeoman.src %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            }
        },
        concurrent: {
            server: [
                'copy:styles'
            ],
            test: [
                'copy:styles'
            ],
            dist: [
                'copy:styles'
            ]
        },
        release: {
            options: {
                push: false, //default: true
                pushTags: false, //default: true
                npm: false, //default: true
                tagName: 'v<%= version %>', //default: '<%= version %>'
                tagMessage: 'Tagging version v<%= version %>', //default: 'Version <%= version %>',
                commitMessage: 'Release v<%= version %>', //default: 'release <%= version %>'
                github: false
            }
        },
        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['package.json', 'bower.json'],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: 'git@github.com:santilland/plotty.git',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
                globalReplace: false,
                prereleaseName: false,
                regExp: false
            }
        },
        compress: {
            release: {
                options: {
                    archive: 'release/plotty.zip'
                },
                files: [
                    { expand: true, cwd: '<%= yeoman.dist %>/scripts', src: ['*.min.js'], dest: 'plotty' },
                    { expand: true, cwd: '<%= yeoman.dist %>/styles', src: ['*.min.css'], dest: 'plotty' },
                    { expand: true, src: ['README.md'], dest: 'plotty' }
                ]
            }
        },
        jsdoc: {
            dist: {
                src: ['README.md', '<%= yeoman.src %>/*.js'],
                options: {
                    destination: 'docs',
                    template: "node_modules/ink-docstrap/template",
                    configure: "jsdoc.json"
                }
            }
        }
    });

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'concurrent:server',
            'autoprefixer',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('server', function () {
      grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
      grunt.task.run(['serve']);
    });


    grunt.registerTask('build', [
        'clean:dist',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'uglify',
        'copy:dist',
        'usemin'
    ]);

    grunt.registerTask('createrelease', [
        'clean:dist',
        'build',
        'docs',
        //'compress:release',
        'release'
    ]);

    grunt.registerTask('docs', [
        'clean:docs',
        'jsdoc'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'build'
    ]);
};
