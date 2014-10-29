'use strict';

var ALPHABET = 'ABCDEFGHJKLMPQRSTUVWXYZ';

module.exports.randomString = function (n) {
	var res = '';
	for (var i = 0; i < n; i++) {
		res += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
	}
	return res;
};
