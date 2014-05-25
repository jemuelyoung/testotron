var fs = require('fs');

function TemplateService (template) {
	this.template = template;
	this.templateBuffer = fs.readFileSync(this.template,'utf8');
	var variableExpression = new RegExp('<%([^%>]+)?%>', 'g');
	this.variables = this.templateBuffer.match(variableExpression);
}

TemplateService.prototype.getTemplate = function() {
	return this.templateBuffer;
};

TemplateService.prototype.getTemplateVariables = function() {
	return this.variables;
};
var templateReader = new TemplateService('spec.template');

console.log(templateReader.getTemplateVariables());