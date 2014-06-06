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


stream.on('data', function(line) {
  lineNumber += 1;
  if (line.indexOf('* @param') > -1) {
    var type = line.match(/\{([^}]+)\}/)[1];
    buildTest(type);
  }
  if (line.indexOf('* @return') > -1) {
    var returnType = line.match(/\{([^}]+)\}/)[1];
    buildTest(returnType);
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

var getFunctionName = function(line) {
  var m =line.match(/var (\d)= function/);
  if (m.length < 1) {
    m = line.match(/function([^\(]+)/);
  }
  return m[1] || false;
};


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