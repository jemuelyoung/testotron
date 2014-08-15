/* global require,module, Buffer */
'use strict';

var through2 = require('through2'),
gutil = require('gulp-util'),
testotron = require('./testotron.js'),
_ = require('underscore'),
mkdirp = require('mkdirp'),
path = require('path');

var defaultOptions = {
  'outputDirectory': '\\tests\\'
};

module.exports = function(options) {
  options = _.extend(defaultOptions, options);

  return through2.obj(function(file, encoding, callback) {
      if (file.isStream()) {
        this.emit('error', new gutil.PluginError('gulp-testotron', 'Streaming not supported'));
      }

      var fileDirectory = path.dirname(file.path);
      var outputDirectory  = fileDirectory + options.outputDirectory;

      // If the output directory doesn't exist, create it
      mkdirp(outputDirectory, function(err) {
        if (err) {
          this.emit('error', new gutil.PluginError('gulp-testotron', 'Error creating directory'));
        }
      });
     
      testotron(file, outputDirectory);
      // Push the file to the next function
      this.push(file);
      // Move onto the next file
      return callback();
    });
  };
