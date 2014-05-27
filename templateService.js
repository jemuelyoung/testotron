var fs = require('fs');

function TemplateService(template) {
	this.template = template;
	this.templateBuffer = fs.readFileSync(this.template, 'utf8');
	var variableExpression = new RegExp('<%([^%>]+)?%>', 'g');
	this.variables = this.templateBuffer.match(variableExpression);
}

TemplateService.prototype.interpolateTemplate = function(values) {
	var self = this;
	var interpolatedTemplate;
	for (var key in values) {
		if (values.hasOwnProperty(key)) {
			var re = '<%' + key + '%>';
			re = new RegExp(re, 'g');
			interpolatedTemplate = self.templateBuffer.replace(re, values[key]);
		}
	}
	return interpolatedTemplate;
};


var templateReader = new TemplateService('spec.template');

console.log(templateReader.interpolateTemplate({'filename': 'foo'}));