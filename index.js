var fs = require('fs'),
  byline = require('byline'),
  exec = require('child_process').exec,
  esprima = require('esprima'),
  estraverse = require('estraverse');


var filename = 'test.js';
var stream = byline(fs.createReadStream(filename), {
  encoding: 'utf8',
  keepEmptyLines: true
});
var SPACING_TYPE = '';
var arr = [];
var fnObj = {};
var lineNumber = 1;

/** Esprima **/
console.log('Processing', filename);
var out = fs.createWriteStream('out.js');
var buffer = '';
var ast = esprima.parse(fs.readFileSync(filename), {loc:true});

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

out.once('open', function() {
  out.write(JSON.stringify(ast));
  out.end();
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

for (var fn in fnObj) {
  for (var x in commentsObj) {
    if ((commentsObj[x].end + 1) === fnObj[fn].start) {
      fnObj[fn].comments = commentsObj[x];
    }
  }
}


function buildTest(type) {
  var testName = filename.slice(0, -3) + 'Spec.js';
  var stream = fs.createWriteStream(testName);
  stream.once('open', function() {
    stream.write("describe(" + filename + ", function() {\n\n");
    stream.write("describe(test1, function() {\n");
    stream.write("it('should do something', function() {\n");
    stream.write("  ");

    stream.write("expect(cbMath).toBeDefined();\n");

    stream.write("});\n");
    stream.write("});\n");
    stream.write("});\n");
    stream.end();
  });
  exec('js-beautify -r -s 2 -f ' + testName + '', function(error, stdout, stderr) {
    console.log(stdout);
  });

}


// Things to do
//1. Get random types of Strings, numbers, etc to seed tests
//2. write init function that creates the beginning of test
//3. pass param and return type to test builder