'use strict';

const log = require('./log');

module.exports = DEBUG => {
	return function (request, _, next) {
		if (!DEBUG) {
			return next();
		}

		const date = new Date();
		log.cyan(`[HSP info ${date}] ${request.url}`);
		next();
	};
};
