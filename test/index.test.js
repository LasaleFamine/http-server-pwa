'use strict';

const {resolve} = require('path');
const supertest = require('supertest');
const test = require('ava');

const httpServer = require('./../src');

const human = 'Chrome';

/**
 * Create the server.
 * @param {!Object} app The app.
 * @return {Promise<object>} Promise of the Server instance and the URL.
 */
const listen = async (folder, options) => {
	const correctFolder = folder ? resolve(__dirname, folder) : null;
	const server = await httpServer(correctFolder, options);
	return {
		server,
		url: `${server.address().address}:${server.address().port}`
	};
};

/**
 * GET a URL with the given user agent.
 * @param {string} userAgent The user agent string.
 * @param {string} host The host part of the URL.
 * @param {string} path The path part of the URL.
 * @return {Promise<!Object>} Promise of the GET response.
 */
const get = (userAgent, host, path) =>
	supertest(host).get(path).set('User-Agent', userAgent);

const port = n => 8080 + Number(n);

test('should work with default params (./ 0.0.0.0:8080)', async t => {
	const {server, url} = await listen();
	const res = await get(human, url, '/');
	t.is(res.status, 404, 'Not found because there is no index.html');
	t.true(res.text.includes('Cannot GET'), 'Correct Cannot GET on no index.html');
	server.close();
});

test('should render correctly from folder', async t => {
	const {server, url} = await listen('./fixture', {p: port(1)});
	const res = await get(human, url, '/');
	t.is(res.text, 'some\n');
	server.close();
});

test('should fallback correctly to index.html', async t => {
	const {server, url} = await listen('./fixture', {port: port(2)});
	const res = await get(human, url, '/not-found');
	t.is(res.text, 'some\n');
	server.close();
});

test('works with specified host', async t => {
	const {server, url} = await listen('./fixture', {h: '127.0.0.1', p: port(3)});
	const res = await get(human, url, '/');
	t.is(url, '127.0.0.1:8083');
	t.is(res.text, 'some\n');
	server.close();
});

test('works with different fallback specified', async t => {
	const {server, url} = await listen('./fixture', {p: port(4), f: 'different.html'});
	const res = await get(human, url, '/something');
	t.is(res.text, 'different fallback\n');
	server.close();
});
