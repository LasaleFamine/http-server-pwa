#!/usr/bin/env node

'use strict';

const meow = require('meow');
const log = require('./lib/log');
const httpServerPwa = require('.');

const cli = meow(`
	Usage
	  $ http-server-pwa [path] [options]

	Options
		-p --port       Port to use [Default: 8080]
		-h --host       Host to use [Default: 0.0.0.0]
		-f --fallback   Fallback HTML file name [Default: index.html]
		-d --debug      Be more verbose [Default: false]
		-h --help       Show this message

	Examples
	  $ http-server-pwa
	  Server started -> ./ 0.0.0.0:8080
	  $ http-server-pwa dist -p 3000
	  Server started -> ./dist 0.0.0.0:3000
`);

httpServerPwa(cli.input[0], cli.flags);

if (process.platform === 'win32') {
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
