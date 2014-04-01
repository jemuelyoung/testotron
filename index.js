var fs = require('fs'),
  byline = require('byline'),
  exec = require('child_process').exec;

var esprima = require('esprima');
var fileName = 'test.js';
var stream = byline(fs.createReadStream(fileName), {
  encoding: 'utf8'
});
var SPACING_TYPE = '';
var arr = [];
stream.on('data', function(line) {
  if (line.indexOf('* @return') > -1) {
    var type = line.match(/\{([^}]+)\}/)[1];
    buildTest(type);
  }

  // if (line.search(/\{/) !== -1 ) {
  //   arr.push(1);
  // }
  // if (line.search(/\}/) !== -1 ) {
  //   arr.pop();
  // }
  // if (arr.length === 0){
  //   console.log("End of function?");
  //   console.log(line);
  // }
});

// depth tree for tabs
var out = [
  [],
  [],
  []
];

function buildTest(type) {
  var stream = fs.createWriteStream("my_fileSpec.js");
  stream.once('open', function(fd) {
    stream.write("describe(" + fileName + ", function() {\n\n");
    stream.write("describe(test1, function() {\n");
    stream.write("it('should do something', function() {\n");
    stream.write("  ");

    stream.write("expect(cbMath).toBeDefined();\n");

    stream.write("});\n");
    stream.write("});\n");
    stream.write("});\n");
    stream.end();
  });
  exec('js-beautify -r -s 2 -f '+ 'my_fileSpec.js' + '', function (error, stdout, stderr) {
  console.log(stdout);
});


}


/**
 * Adds the right amount of indentation to a line depending
 * on the amount passed in.
 * @param  {Number} spaceAmount The number of places to indent
 * @return {String}             A string of spaces or tabs.
 */
function indent(spaceAmount) {
  var indentAmount = '';
  // 0 means no indentation so we start at 1
  for (var i = 1; i <= spaceAmount; i++) {
    indentAmount += SPACING_TYPE;
  }
  return indentAmount;
}

function generateFromDepthTree(callback) {
  buffer = '';
  // out.forEach(function(el, i) {
  //   out[i].forEach(function(line, index) {
  //     buffer += indent(index) + line;
  //   });
  // });

  // go through each array and pop off the first child. When we reach the end of the parent array,
  // repeat popping. If an array is empty, delete it.
  var count = 0;
  var sent = [];
  while (out.length !== sent.length) {
    // end of the parent array. Reset the counter to start over
    if (count === out.length) {
      count = 0;
      continue;
    }
    if (sent.indexOf(count) === -1) {
      buffer += indent(count) + out[count].shift();
    } else {
      count += 1;
      continue;
    }
    if (out[count].length <= 0) {
      sent.push(count);
    } else {
      count += 1;
    }
  }
  callback(buffer);
}


// Things to do
//1. Get random types of Strings, numbers, etc to seed tests
//2. write init function that creates the beginning of test
//3. pass param and return type to test builder