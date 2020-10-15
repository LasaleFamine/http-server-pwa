'use strict';

const express = require('express');
const staticWithCompression = require('express-static-gzip');

module.exports = {
	getStaticMiddleware: (ROOT, {GZIP, BROTLI}) => {
		if (!GZIP && !BROTLI) {
			return express.static(ROOT);
		}

		const options = {
			orderPreference: ['identity']
		};

		if (GZIP) {
			options.orderPreference.unshift('gzip');
		}

		if (BROTLI) {
			options.enableBrotli = true;
			options.orderPreference.unshift('br');
		}

		return staticWithCompression(ROOT, options);
	}
};
