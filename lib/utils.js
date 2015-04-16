
function Utils() {
	this.charString = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
}

Utils.prototype.random = function(types) {
	var self = this;
	var vals = [];
	var len, i;
	var _getRandNumber = function(max) {
		return Math.floor(Math.random() * max);
	};

	for (var index in types) {
		var type = types[index];
		if (type === 'Number') {
			vals.push(_getRandNumber(1000));
			continue;
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
				str += self.charString[_getRandNumber(52)];
			}

			vals.push('\'' + str + '\'');
			continue;
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
			continue;
		}

		if (type === 'Object') {
			/**
			 * The length the string to return
			 * @type {Number}
			 */
			len = _getRandNumber(10);
			/**
			 * The array to return
			 * @type {Array}
			 */
			var randStr = [];
			// build a random string of len length
			for (i = len - 1; i >= 0; i--) {
				randStr.push(_getRandNumber(11));
			}

			vals.push('{foo:' + randStr.toString() + '}');
			continue;
		}
	};

	return vals;
};


module.exports = new Utils();