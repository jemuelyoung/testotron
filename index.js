var fs = require('fs'),
  byline = require('byline'),
  exec = require('child_process').exec,
  esprima = require('esprima'),
  estraverse = require('estraverse'),
  templateService = require('./templateService.js'),
  _ = require('underscore');


var filename = 'test.js';
var stream = byline(fs.createReadStream('js/' + filename), {
  encoding: 'utf8',
  keepEmptyLines: true
});
var SPACING_TYPE = '';
var arr = [];
var fnObj = {};
var lineNumber = 0;

console.log('Processing', filename);

/** Esprima **/
var ast = esprima.parse(fs.readFileSync('js/' + filename), {loc:true});

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


var commentsObj = {};
var current = false;
stream.on('data', function(line) {
  // keep track of the current line number
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
//console.log(template);
fs.writeFile('js/testSpec.js', template, function() {
  console.log('file written');
});
// console.log(templateReader.interpolateTemplate({'filename': 'foo', 'testFn': 'function(){alert("foo");}' }));

// TODO: call template service and pass in fnObj
});















/*******************************/

// Things to do
//1. Get random types of Strings, numbers, etc to seed tests
//2. write init function that creates the beginning of test
//3. pass param and return type to test builder