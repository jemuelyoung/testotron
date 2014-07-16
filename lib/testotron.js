/*jslint node: true */
'use strict';

// API
module.exports = function(file) {
  createTest(file);
};

var fs = require('fs'),
  byline = require('byline'),
  exec = require('child_process').exec,
  esprima = require('esprima'),
  estraverse = require('estraverse'),
  templateService = require('./templateService.js'),
  _ = require('underscore');


function createTest(pathToFile) {
  console.log('Processing', pathToFile);
  /**
   * A container object that stores the function data
   * @type {Object}
   */
  var fnObj = {};

  /**
   * A container object that stores the comment data
   * @type {Object}
   */
  var commentsObj = {};

  /**
   * The current line number
   * @type {Number}
   */
  var lineNumber = 0;

  /**
   * Tracks the current comment block attached to the function
   * @type {Boolean|Number}
   */
  var current = false;

  /**
   * The readstream of the file
   */
  var stream = byline(fs.createReadStream(pathToFile), {
    encoding: 'utf8',
    keepEmptyLines: true
  });

  /**
   * The abstract syntax tree of the file
   * @type {Object}
   */
  var ast = esprima.parse(fs.readFileSync(pathToFile), {loc:true});

  // traverse the file pulling out any relevant information
  estraverse.traverse(ast, {
    enter: function(node) {
      if (node.type === 'FunctionDeclaration') {
        // save all of the function names along with their corresponding
        // start and end lines
        fnObj[node.id.name] = {
          start: node.loc.start.line,
          end: node.loc.end.line,
        };
      }
    }
  });

  stream.on('data', function(line) {
    lineNumber += 1;

    if (line.trim() === '') {
      return;
    }
    // mark start of comment block
    if (line.indexOf('/**') > -1) {
      // create comment object
      commentsObj[lineNumber] = {
        start: lineNumber
      };
      current = lineNumber;
    }
    // mark the end of the comment block
    if (line.indexOf('*/') > -1 || line.indexOf('**/') > -1) {
      commentsObj[current]['end'] = lineNumber;
      current = false;
    }
    if (line.indexOf('* @param') > -1 && current) {
      var type = line.match(/\{([^}]+)\}/)[1];
      // TODO: allow for multiple params
      commentsObj[current].param = type;
    }
    if (line.indexOf('* @return') > -1 && current) {
      var returnType = line.match(/\{([^}]+)\}/)[1];
      commentsObj[current]['return'] = returnType;
    }
  });


  stream.on('end', function() {

    // attach comment object to function object
    for (var fn in fnObj) {
      for (var x in commentsObj) {
        // console.dir(commentsObj[x]);
        // get the ending line of comment block and attempt to match with a
        // function block that starts on the next line
        if ((commentsObj[x].end + 1) === fnObj[fn].start) {
          fnObj[fn].comments = commentsObj[x];
        }
      }
    }

    var templateReader = new templateService('spec.template');
    var template = '';
    _.each(fnObj, function(values, name) {
      template += templateReader.interpolateTemplate(templateReader.createValues(name, values));

    });

    fs.writeFile('js/' + _getFileNameFromPath(pathToFile) + 'Spec.js', template, function() {
      console.log('file written');
    });
  // console.log(templateReader.interpolateTemplate({'pathToFile': 'foo', 'testFn': 'function(){alert("foo");}' }));

  // TODO: call template service and pass in fnObj
  });

}


function _getFileNameFromPath(pathToFile) {
  var pathDelimiter = '/';
  if (process.platform === 'win32') {
    pathDelimiter = '\\';
  }
  var firstIndex = pathToFile.lastIndexOf(pathDelimiter) + 1;
  var lastIndex = pathToFile.indexOf('.js');

  return pathToFile.substring(firstIndex, lastIndex);

}