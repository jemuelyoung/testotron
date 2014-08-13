/*jslint node: true */
'use strict';

var fs = require('fs'),
  _ = require('underscore'),
  utils = require('./utils.js');

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
 * Creates the values needed to interpolate the template.
 * Accepts a function name and an object that contains the data needed to build
 * the test.
 * @param  {String} name The name of the function that we're building the test for
 * @param  {Object} data The function data
 * @return {Object}      The values 
 */
TemplateService.prototype.createValues = function(name, data) {
  var values = {};
  values.fnName = name;

  _.each(data, function(value, key) {
    if (key === 'comments') {
      values.testFn = createTest(name, value.params, value['return']);
      // values.param = value.param;
    }
  });

  return values;
};

/**
 * Creates a simple test from the given parameters
 * @param  {String} fnName     The name of the function
 * @param  {Array} paramTypes  The types of params that the function accepts
 * @param  {String} returnType The return type of the function
 * @return {String}            The test
 */
var createTest = function(fnName, paramTypes, returnType) {
  var params = utils.random(paramTypes);
  if (returnType === 'Array') {
    // expect(Array.isArray(someFn(paramTypes))).toBe(true)
    return 'expect(Array.isArray(' + fnName + '(' + params.join(',') +
    '))).toBe(true);';
  }
  // expect(someFn(paramTypes)).toBe(typeOf returnType)
  return 'expect(typeof ' + fnName + '(' + params.join(', ') +
    ')).toBe(\'' + returnType.toLowerCase() + '\');';
};



module.exports = TemplateService;