/*
 * grunt-sitemap-generator
 * https://github.com/headcanon/grunt-sitemap-generator
 *
 * Copyright (c) 2014 Nick Donohue
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    sitemap_generator: {

      options: {
        hostname: "http://www.myfab5.com",
        cacheTime: 600000,
        changeFrequency: "daily",
        priority: 0.7,

        dest: 'dist/sitemap.xml'
      },

      users: {
        options: {
          //endpoint to fetch
          endpoint: {
            path: "http://api.myfab5.com/user/search/a?limit=50",

            // process the raw response if your api is being dumb
            process: function(response) {
              return response.users;
            }
          },

          // this function recieves an item returned from the list of things
          // and returns the object that will be placed in the sitemap,
          // or false if it shouldn't
          filter: function(item) {
            return {
              url: "/user/" + item.username
            };
          }
        }
      },

      default_options: {
        options: {},
        files: {
          'tmp/default_options': ['test/fixtures/testing', 'test/fixtures/123'],
        },
      },
      custom_options: {
        options: {
          separator: ': ',
          punctuation: ' !!!',
        },
        files: {
          'tmp/custom_options': ['test/fixtures/testing', 'test/fixtures/123'],
        },
      },
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'sitemap_generator', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};