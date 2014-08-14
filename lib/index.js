/* global require,module */
'use strict';

var through2 = require('through2');
var gutil = require('gulp-util');
var testotron = require('./testotron.js');

module.exports = function(params) {
  return through2.obj(function(file, encoding, callback) {
    var json, contents;

      if (file.isStream()) {
        this.emit('error', new gutil.PluginError('gulp-testotron', 'Streaming not supported'));
      }

      testotron(file.path);
      return callback();
    });
  };
