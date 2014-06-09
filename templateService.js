var fs = require('fs'),
  _ = require('underscore');

function TemplateService(template) {
  this.template = template;
  this.templateBuffer = fs.readFileSync(this.template, 'utf8');
  var variableExpression = new RegExp('<%([^%>]+)?%>', 'g');
  this.variables = this.templateBuffer.match(variableExpression);

}

TemplateService.prototype.interpolateTemplate = function(values) {
  var self = this;
  var interpolatedTemplate = self.templateBuffer;
  for (var key in values) {
    if (values.hasOwnProperty(key)) {
      var re = '<%' + key + '%>';
      re = new RegExp(re, 'g');
      interpolatedTemplate = interpolatedTemplate.replace(re, values[key]);
    }
  }
  return interpolatedTemplate;
};

TemplateService.prototype.createValues = function(obj) {
  var values = {};
  _.each(obj, function(fn, name) {
    values.filename = name;
    _.each(fn, function(value, key){
      if (key === 'comments') {
        values.testFn = getTest(value['return']);
        values.param = value.param;
      }
    });
  });

  return values;
};

var getTest = function(type) {
  if (type === 'String') {
    return 'expect(typeof <%param%>).toBe("string");';
  }
  if (type === 'Number') {
    return 'expect(typeof <%param%>).toBe("number");';
  }
};



module.exports = TemplateService;