/*
 * grunt-sitemap-generator
 * https://github.com/headcanon/grunt-sitemap-generator
 *
 * Copyright (c) 2014 Nick Donohue
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('lodash'),
  request = require('superagent'),
  sm = require('sitemap');

module.exports = function(grunt) {

  grunt.registerMultiTask('sitemap_generator', 'Generate a sitemap for a dynamic application', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      url: '/',
      changeFrequency: 'daily',
      priorty: 0.7,

      endpoint: {
        path: '/'
      }
    });

    var done = this.async();

    var urlDefaults = {
      url: options.url,
      changefrequency: options.changeFrequency,
      priority: options.priority
    }

    grunt.log.ok("requesting " + options.endpoint.path);

    request
      .get(options.endpoint.path)
      .end(function(err, response) {
        grunt.log.ok("fetch successful, processing data");

        var data = JSON.parse(response.text);

        // preprocess data if option given
        if (options.endpoint.process)
          data = options.endpoint.process(data);

        // convert returned data to sitemap url objects
        if (options.filter)
          data = data.map(function(item) {
            return _.merge(urlDefaults, options.filter(item));
          });

        // initialize sitemap with data
        var sitemap = sm.createSitemap({
          hostname: options.hostname,
          cacheTime: options.cacheTime,
          urls: data
        });

        // write sitemap to file
        sitemap.toXML(function(xml) {
          grunt.log.ok("writing sitemap data to " + options.dest);

          grunt.file.write(options.dest, xml);
          done();
        });
      });
  });

};