var fs = require('fs'),
  _ = require('underscore');

function TemplateService(template) {
  this.template = template;
  this.templateBuffer = fs.readFileSync(this.template, 'utf8');
  var variableExpression = new RegExp('<%([^%>]+)?%>', 'g');
  this.variables = this.templateBuffer.match(variableExpression);

}

/**
 * Takes a set a values and inserts them into the template according to their
 * keys.
 * @param  {Object} values The key/value pairs. The keys match the template strings
 * @return {String}        The template with the values inserted
 */
TemplateService.prototype.interpolateTemplate = function(values) {
  var interpolatedTemplate = this.templateBuffer;
  //console.log(values)
  for (var key in values) {
    if (values.hasOwnProperty(key)) {
      var re = '<%' + key + '%>';
      re = new RegExp(re, 'g');
      interpolatedTemplate = interpolatedTemplate.replace(re, values[key]);
    }
  }
  return interpolatedTemplate;
};

/**
 * Accepts function name and an object that contains the data needed to build
 * the test. The object is read and 
 * @param  {String} name The name of the function that we're building the test for
 * @param  {[type]} obj  [description]
 * @return {[type]}      [description]
 */
TemplateService.prototype.createValues = function(name, obj) {
  var values = {};
  values.fnName = name;

  _.each(obj, function(value, key){
    if (key === 'comments') {
      values.testFn = getTest(name, value.param, value['return']);
      values.param = value.param;
    }
  });

  return values;
};

var getTest = function(fnName, param, returnType) {
  if (param === 'Number') {
    param = 42;
  }
  if (param === 'String') {
    param = '\'This is a test\'';
  }
  if (param === 'Array') {
    param = [1, 2];
  }
  // expect(someFn(param)).toBe(typeOf returnType)
  return 'expect(typeof ' + fnName + '(' + param + ')).toBe(\''+returnType.toLowerCase() +'\');';
};



module.exports = TemplateService;