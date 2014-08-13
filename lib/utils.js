var _ = require('underscore');

function Utils() {
	this.charString = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
}

Utils.prototype.random = function(types) {
	var vals = [];
	var len, i;
	var _getRandNumber = function(max) {
		return Math.floor(Math.random() * max);
	};

	_.each(types, function(type) {
		if (type === 'Number') {
			vals.push(_getRandNumber(1000));
			return;
		}

		if (type === 'String') {
			/**
			 * The length the string to return
			 * @type {Number}
			 */
			len = _getRandNumber(30);
			/**
			 * The string to return
			 * @type {String}
			 */
			var str = '';
			// build a random string of len length
			for (i = len - 1; i >= 0; i--) {
				str += this.charString[_getRandNumber(52)];
			}

			vals.push('\'' + str + '\'');
			return;
		}

		if (type === 'Array') {
			/**
			 * The length the string to return
			 * @type {Number}
			 */
			len = _getRandNumber(10);
			/**
			 * The array to return
			 * @type {Array}
			 */
			var arr = [];
			// build a random string of len length
			for (i = len - 1; i >= 0; i--) {
				arr.push(_getRandNumber(11));
			}

			vals.push('[' + arr.toString() + ']');
			return;
		}
	});
	
	return vals;
};


module.exports = new Utils();