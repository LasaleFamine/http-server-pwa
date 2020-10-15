'use strict';

const {resolve, join} = require('path');
const {createServer} = require('https');
const express = require('express');
const fallback = require('express-history-api-fallback');
const {redirectToHTTPS} = require('express-http-to-https');
const staticWithCompression = require('express-static-gzip');
const certificate = require('devcert-san');

const pupperender = require('pupperender');

const loggerMiddleware = require('./lib/logger-middleware');
const log = require('./lib/log');

const getStHost = () => process.platform === 'win32' ? '127.0.0.1' : 'localhost';

module.exports = async (folder, options) => {
	const opt = typeof options === 'object' ? {...options} : {};
	const ROOT = resolve(folder || './');
	const PORT = opt.p || opt.port || 8080;
	const HOST = opt.h || opt.host || getStHost();
	const FALLINDEX = opt.f || opt.fallback || 'index.html';
	const DEBUG = opt.d || opt.debug || false;
	const LOCALHTTPS = opt.s || opt.https || false;
	const CACHE = opt.c || opt.cache || false;
	const CACHE_TTL = opt.cacheTTL || 3600;
	const SSL = opt.ssl || false;
	const IS_DEV = process.env.NODE_ENV !== 'production';
	const GZIP = opt.gzip || opt.g || false;
	const BROTLI = opt.brotli || opt.b || false;

	const app = express();

	// Don't redirect if the hostname is `localhost` or `127.0.0.1`
	app.use(redirectToHTTPS(LOCALHTTPS ? [] : [/localhost|127.0.0.1/]));

	app.use(loggerMiddleware(DEBUG));
	app.use(pupperender.makeMiddleware({debug: DEBUG, useCache: CACHE, cacheTTL: CACHE_TTL}));
	if (GZIP || BROTLI) {
		const compression = {orderPreference: ["identity"]};
		GZIP && (compression.orderPreference.unshift('gzip'));
		BROTLI && ((compression.enableBrotli = true), (compression.orderPreference.unshift('br')));
		console.log(compression);
		app.use(staticWithCompression(ROOT, compression));
	} else {
		app.use(express.static(ROOT));
	}
	app.use(fallback(FALLINDEX, {root: ROOT}));

	const sslCert = SSL && IS_DEV ?
		await certificate.default('pwa-server', {installCertutil: true}) : null;

	return new Promise(resolve => {
		const server = sslCert ? createServer(sslCert, app) : app;
		const response = server.listen(
			PORT,
			HOST,
			() => {
				log.green('HSP started 🤘');
				log.info(
					`Path: ${ROOT} \nHost: ${sslCert ? 'https' : 'http'}://${HOST}:${PORT} \nFalling on: ${join(ROOT, FALLINDEX)}`
				);
				log.yellow('Hit CTRL-C to stop the server');
				resolve(response);
			}
		);
	});
};

