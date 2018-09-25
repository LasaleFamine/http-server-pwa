'use strict';

const {resolve, join} = require('path');
const fs = require('fs');
const {createServer} = require('https');
const express = require('express');
const fallback = require('express-history-api-fallback');
const {redirectToHTTPS} = require('express-http-to-https');
const certificate = require('devcert-san');

const pupperender = require('pupperender');

const loggerMiddleware = require('./lib/logger-middleware');
const log = require('./lib/log');

const getStHost = () => process.platform === 'win32' ? '127.0.0.1' : '0.0.0.0';

module.exports = async (folder, options) => {
	const opt = typeof options === 'object' ? {...options} : {};
	const ROOT = resolve(folder || './');
	const PORT = opt.p || opt.port || 8080;
	const HOST = opt.h || opt.host || getStHost();
	const FALLINDEX = opt.f || opt.fallback || 'index.html';
	const DEBUG = opt.d || opt.debug || false;
	const LOCALHTTPS = opt.s || opt.https || false;
	const PEM_KEY = opt.pemKey || null;
	const PEM_CERT = opt.pemCert || null;
	const IS_DEV = process.env.NODE_ENV !== 'production';

	const app = express();

	app.use(redirectToHTTPS(LOCALHTTPS ? [] : [/localhost/]));

	app.use(loggerMiddleware(DEBUG));
	app.use(pupperender.makeMiddleware({debug: DEBUG}));
	app.use(express.static(ROOT));
	app.use(fallback(FALLINDEX, {root: ROOT}));

	let ssl = null;

	switch (true) {
		case IS_DEV:
			ssl = await certificate.default('pwa-server', {installCertutil: true});
			break;
		case PEM_KEY && PEM_CERT:
			ssl = {
				key: fs.readFileSync(resolve(PEM_KEY)),
				cert: fs.readFileSync(resolve(PEM_CERT))
			};
			break;
		default:
			// Pass
	}

	const server = ssl ? createServer(ssl, app) : app;
	server.listen(
		PORT,
		HOST,
		() => {
			log.green('HSP started 🤘');
			log.info(
				`Path: ${ROOT} \nHost: https://${HOST}:${PORT} \nFalling on: ${join(ROOT, FALLINDEX)}`
			);
			log.yellow('Hit CTRL-C to stop the server');
		}
	);

	return {
		PORT,
		HOST
	};
};

