/* global require,module, Buffer */
'use strict';

var through2 = require('through2'),
gutil = require('gulp-util'),
testotron = require('./testotron.js'),
_ = require('underscore');

var defaultOptions = {
  'outputDirectory': './tests/',
  'noGulp': false
};

module.exports = function(options) {
  options = _.extend(defaultOptions, options);
  return through2.obj(function(file, encoding, callback) {
      if (file.isStream()) {
        this.emit('error', new gutil.PluginError('gulp-testotron', 'Streaming not supported'));
      }

      testotron(file, options);
      this.push(file);
      return callback();
    });
  };
