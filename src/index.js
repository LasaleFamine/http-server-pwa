'use strict';

const {resolve, join} = require('path');
const express = require('express');
const fallback = require('express-history-api-fallback');
const httpsRedirect = require('express-https-redirect');
const pupperender = require('pupperender');

const loggerMiddleware = require('./lib/logger-middleware');
const log = require('./lib/log');

const getStHost = () => process.platform === 'win32' ? '127.0.0.1' : '0.0.0.0';

module.exports = (folder, options) => {
	const opt = typeof options === 'object' ? Object.assign({}, options) : {};
	const ROOT = resolve(folder || './');
	const PORT = opt.p || opt.port || 8080;
	const HOST = opt.h || opt.host || getStHost();
	const FALLINDEX = opt.f || opt.fallback || 'index.html';
	const DEBUG = opt.d || opt.debug || false;
	const LOCALHTTPS = opt.s || opt.https || false;

	const app = express();

	if (process.env.NODE_ENV !== 'test') {
		app.use('/', httpsRedirect(LOCALHTTPS));
	}

	app.use(loggerMiddleware(DEBUG));
	app.use(pupperender.makeMiddleware({debug: DEBUG}));
	app.use(express.static(ROOT));
	app.use(fallback(FALLINDEX, {root: ROOT}));

	return app.listen(
		PORT,
		HOST,
		() => {
			log.green('HSP started 🤘');
			log.info(
				`Path: ${ROOT} \nHost: http://${HOST}:${PORT} \nFalling on: ${join(ROOT, FALLINDEX)}`
			);
			log.yellow('Hit CTRL-C to stop the server');
		}
	);
};

