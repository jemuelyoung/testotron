function Utils() {
	this.charString = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
}

Utils.prototype.random = function(type) {
	var len, i;
	var _getRandNumber = function(max) {
		return Math.floor(Math.random() * max);
	};

	if (type === 'Number') {
		return _getRandNumber(1000);
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

		return '\'' + str + '\'';
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

		return '[' + arr.toString() + ']';
	}
};


module.exports = new Utils();