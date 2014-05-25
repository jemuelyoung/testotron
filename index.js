var fs = require('fs'),
  byline = require('byline'),
  exec = require('child_process').exec,
  esprima = require('esprima'),
  estraverse = require('estraverse');


var filename = 'test.js';
var stream = byline(fs.createReadStream(filename), {
  encoding: 'utf8'
});
var SPACING_TYPE = '';
var arr = [];


/** Esprima **/
console.log('Processing', filename);
var out = fs.createWriteStream('out.js');
var buffer = '';
var ast = esprima.parse(fs.readFileSync(filename), {loc:true});

estraverse.traverse(ast, {
  enter: function(node) {
    console.dir(node);

  }
});

out.once('open', function() {
  out.write(JSON.stringify(ast));
  out.end();
});



stream.on('data', function(line) {
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