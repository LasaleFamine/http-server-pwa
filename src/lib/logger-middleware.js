'use strict';

const log = require('./log');

module.exports = DEBUG => {
	return function (req, res, next) {
		if (!DEBUG) {
			return next();
		}

		const date = new Date();
		log.cyan(`[HSP info ${date}] ${req.url}`);
		next();
	};
};
