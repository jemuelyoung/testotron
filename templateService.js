var fs = require('fs');

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

var getTest = function(type) {
  if (type === 'string') {
    return 'expect(typeof <%param%>).toBe("string");';
  }
  if (type === 'number') {
    return 'expect(typeof <%param%>).toBe("number");';
  }
};


var templateReader = new TemplateService('spec.template');


console.log(templateReader.interpolateTemplate({'filename': 'foo', 'testFn': 'function(){alert("foo");}' }));