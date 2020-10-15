#!/usr/bin/env node

'use strict';

const meow = require('meow');
const log = require('./lib/log');
const httpServerPwa = require('.');

const IS_WIN = process.platform === 'win32';

if (IS_WIN) {
	require('readline').createInterface({
		input: process.stdin,
		output: process.stdout
	}).on('SIGINT', () => process.emit('SIGINT'));
}

process.on('SIGINT', () => {
	log.red('\nhttp-server-pwa stopped.');
	process.exit();
});

process.on('SIGTERM', () => {
	log.red('\nhttp-server stopped.');
	process.exit();
});

const cli = meow(`
	Usage
	  $ http-server-pwa [path] [options]

	Options
		-p --port       Port to use [Default: 8080]
		-h --host       Host to use [Default: localhost | Windows: 127.0.0.1]
		-f --fallback   Fallback HTML file name [Default: index.html]
		-s --https      Enable HTTPS redirect on localhost [Default: false]
		--ssl           Auto-generation SSL certificate during development [Default: false]
		-c --cache      Enable cache for Puppeteer rendering [Default: false]
		--cacheTTL      Seconds until cached content is disregarded and puppeterized again [Default: 3600 (s)].
		-d --debug      Be more verbose [Default: false]
		-g --gzip		Enable serving of gzipped files if available [Default: false]
		-b --brotli		Enable serving of brotli compressed files if available [Default: false]
		-h --help       Show this message

	Examples
	  $ http-server-pwa
	  Server started -> ./ localhost:8080
	  $ http-server-pwa dist -p 3000
	  Server started -> ./dist localhost:3000
`);

httpServerPwa(cli.input[0], cli.flags);

