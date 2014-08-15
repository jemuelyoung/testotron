/* global require,module, Buffer */
'use strict';

var through2 = require('through2'),
gutil = require('gulp-util'),
testotron = require('./testotron.js'),
_ = require('underscore'),
mkdirp = require('mkdirp');

var defaultOptions = {
  'outputDirectory': '/tests/'
};

module.exports = function(options) {
  options = _.extend(defaultOptions, options);

  return through2.obj(function(file, encoding, callback) {
      if (file.isStream()) {
        this.emit('error', new gutil.PluginError('gulp-testotron', 'Streaming not supported'));
      }
      // Create the directory
      var dir = file.dirname;
      console.dir(file);
      mkdirp(dir + options.outputDirectory, function(err) {
        console.log(err);
      });
      testotron(file, options);
      this.push(file);
      return callback();
    });
  };
