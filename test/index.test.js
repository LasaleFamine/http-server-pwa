'use strict';

const test = require('ava');
// eslint-disable-next-line ava/no-import-test-files
const {listen, get, port} = require('./helpers');

const human = 'Chrome';
const bot = 'slackbot';

test('should work with default params (./ 0.0.0.0:8080)', async t => {
	const {server, url} = await listen(null, {h: 'localhost'});
	const response = await get(human, url, '/');
	// t.is(response.status, 404, 'Not found because there is no index.html');
	t.true(response.text.includes('Cannot GET'), 'Correct Cannot GET on no index.html');
	server.close();
});

test('should render correctly from folder', async t => {
	const {server, url} = await listen('./fixture', {h: 'localhost', p: port()});
	const response = await get(human, url, '/');
	t.is(response.text, 'some\n');
	server.close();
});

test('should fallback correctly to index.html', async t => {
	const {server, url} = await listen('./fixture', {h: 'localhost', p: port()});
	const response = await get(human, url, '/not-found');
	t.is(response.text, 'some\n');
	server.close();
});

test('works with specified host', async t => {
	const {server, url} = await listen('./fixture', {h: '127.0.0.1', p: port()});
	const response = await get(human, url, '/');
	t.is(url, '127.0.0.1:8083');
	t.is(response.text, 'some\n');
	server.close();
});

test('works with different fallback specified', async t => {
	const {server, url} = await listen(
		'./fixture',
		{h: 'localhost', p: port(), f: 'different.html'}
	);
	const response = await get(human, url, '/something');
	t.is(response.text, 'different fallback\n');
	server.close();
});

test('https redirect by default on not-localhost (with port and path specified)', async t => {
	const {server, url} = await listen('./fixture',	{h: '0.0.0.0', p: port()});
	const response = await get(human, url, '/something');
	t.is(response.text, 'Found. Redirecting to https://0.0.0.0:8085/something');
	t.is(response.status, 302);
	server.close();
});

test('https redirect also on localhost', async t => {
	const {server, url} = await listen('./fixture',	{h: 'localhost', p: port(), s: true});
	const response = await get(human, url, '/something');
	t.is(response.text, 'Found. Redirecting to https://localhost:8086/something');
	t.is(response.status, 302);
	server.close();
});

test('cache results works correctly', async t => {
	const {server, url} = await listen('./fixture',	{h: 'localhost', p: port(), cache: true});
	const response = await get(bot, url, '/something');
	t.is(response.status, 200);
	t.false(Boolean(response.get('Expires')));
	const cachedResponse = await get(bot, url, '/something');
	t.is(cachedResponse.status, 200);
	t.true(Boolean(cachedResponse.get('Expires')));
	server.close();
});

test('cache results respect TTL', async t => {
	const {server, url} = await listen('./fixture',	{h: 'localhost', p: port(), cache: true, cacheTTL: 1});
	const response = await get(bot, url, '/something');
	t.is(response.status, 200);
	t.false(Boolean(response.get('Expires')));
	await new Promise(resolve => setTimeout(resolve, 2000));
	const cachedResponse = await get(bot, url, '/something');
	t.is(cachedResponse.status, 200);
	t.false(Boolean(cachedResponse.get('Expires')));
	server.close();
});
