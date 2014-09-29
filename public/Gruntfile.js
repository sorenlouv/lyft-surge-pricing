/*jslint node: true */
module.exports = function(grunt) {
  'use strict';

  // Load NPM modules as needed
  require('jit-grunt')(grunt);

  grunt.initConfig({

    /*
    * Project variables
    ****************************/
    pkg: grunt.file.readJSON('package.json'),

    // Dist files
    dist_js_file: 'dist/lyft.js',
    dist_css_file: 'dist/lyft.css',
    dist_css_file_temp: 'dist/temp.css',

    // Source files
    source_js_files: 'src/js/**/*.js',
    source_less_files: 'src/less/**/*.less',
    source_less_folder: 'src/less/',

    // Template
    template_files: 'templates/**/*.html',

    /*
    * Jshint
    * All javascript files in src/js
    * http://jshint.com/docs/options/
    ****************************/
    jshint: {
      files: '<%= source_js_files %>',
      options: {
        jshintrc: '../.jshintrc'
      }
    },

    /*
    * Concatenate js files
    * All javascript files in src/js
    ****************************/
    concat: {
      dist: {
        src: '<%= source_js_files %>',
        dest: '<%= dist_js_file %>'
      }
    },

    /*
    * Uglify
    * Minify JS
    ****************************/
    uglify: {
      options: {
        mangle: true,
        compress: {
          drop_console: true
        }
      },
      dist: {
        files: {
          '<%= dist_js_file %>': ['<%= dist_js_file %>']
        }
      }
    },

    /*
    * Karma
    * Test runner
    ****************************/
    karma: {
      single: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      },
      watch: {
        configFile: 'test/karma.conf.js'
      }
    },

    /*
    * Less: compile less to css
    ****************************/
    less: {
      dist: {
        options: {
          paths: ['<%= source_less_folder %>']
        },
        src: '<%= source_less_files %>',
        dest: '<%= dist_css_file_temp %>'
      }
    },

    /*
    * Prefixer: Add/remove css prefixes
    ****************************/
    autoprefixer: {
      dist: {
        options: {
          browsers: ['last 2 version', 'ie 9']
        },
        src: '<%= dist_css_file_temp %>',
        dest: '<%= dist_css_file %>'
      }
    },

    /*
    * CssLint
    * Final distribution css file
    ****************************/
    csslint: {
      options: {
        csslintrc: '.csslintrc' // Get CSSLint options from external file.
      },
      strict: {
        src: ['<%= dist_css_file %>']
      }
    },

    /*
    * CssMin
    * Minify CSS
    ****************************/
    cssmin: {
      combine: {
        files: {
          '<%= dist_css_file %>': ['<%= dist_css_file %>']
        }
      }
    },

    /*
    * Cache busting
    * Append md5 hash to JS and CSS assets
    ****************************/
    hashres: {
      options: {
        fileNameFormat: '${name}.${ext}?${hash}',
        renameFiles: false
      },
      prod: {
        src: ['<%= dist_js_file %>', '<%= dist_css_file %>'],
        dest: 'index.html'
      }
    },

    /*
    * Watch changes and invoke specified tasks
    ****************************/
    watch: {
      // Javacript: jshint and concat
      js: {
        files: '<%= source_js_files %>',
        tasks: ['jshint', 'concat'],
        options: {
          livereload: true
        }
      },

      // Less: Compile less to CSS
      less: {
        files: '<%= source_less_files %>',
        tasks: ['less:dist']
      },

      // CSS: Add vendor prefix and CSSLint
      css: {
        files: '<%= dist_css_file_temp %>',
        tasks: ['autoprefixer:dist']
      },

      // Live reload on change (no tasks)
      css_reload: {
        files: '<%= dist_css_file %>',
        options: {
          livereload: true
        }
      },

      // Live reload on change (no tasks)
      templates: {
        files: ['<%= template_files %>', 'index.html'],
        options: {
          livereload: true
        }
      }
    }
  });

  /*
  * Tasks
  ****************************/
  grunt.registerTask('default', ['jshint', 'concat', 'less:dist', 'autoprefixer:dist']);

  grunt.registerTask('production', ['jshint', 'concat', 'less:dist', 'autoprefixer:dist', 'csslint', 'uglify', 'cssmin', 'hashres', 'karma:single']);

  grunt.registerTask('startWatch', ['default', 'watch']);

};
