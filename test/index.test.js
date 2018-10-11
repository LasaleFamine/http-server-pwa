'use strict';

const test = require('ava');

const {listen, get, port} = require('./helpers');

const human = 'Chrome';
const bot = 'slackbot';

test('should work with default params (./ 0.0.0.0:8080)', async t => {
	const {server, url} = await listen(null, {h: 'localhost'});
	const res = await get(human, url, '/');
	// t.is(res.status, 404, 'Not found because there is no index.html');
	t.true(res.text.includes('Cannot GET'), 'Correct Cannot GET on no index.html');
	server.close();
});

test('should render correctly from folder', async t => {
	const {server, url} = await listen('./fixture', {h: 'localhost', p: port()});
	const res = await get(human, url, '/');
	t.is(res.text, 'some\n');
	server.close();
});

test('should fallback correctly to index.html', async t => {
	const {server, url} = await listen('./fixture', {h: 'localhost', p: port()});
	const res = await get(human, url, '/not-found');
	t.is(res.text, 'some\n');
	server.close();
});

test('works with specified host', async t => {
	const {server, url} = await listen('./fixture', {h: '127.0.0.1', p: port()});
	const res = await get(human, url, '/');
	t.is(url, '127.0.0.1:8083');
	t.is(res.text, 'some\n');
	server.close();
});

test('works with different fallback specified', async t => {
	const {server, url} = await listen(
		'./fixture',
		{h: 'localhost', p: port(), f: 'different.html'}
	);
	const res = await get(human, url, '/something');
	t.is(res.text, 'different fallback\n');
	server.close();
});

test('https redirect by default on not-localhost (with port and path specified)', async t => {
	const {server, url} = await listen('./fixture',	{h: '0.0.0.0', p: port()});
	const res = await get(human, url, '/something');
	t.is(res.text, 'Found. Redirecting to https://0.0.0.0:8085/something');
	t.is(res.status, 302);
	server.close();
});

test('https redirect also on localhost', async t => {
	const {server, url} = await listen('./fixture',	{h: 'localhost', p: port(), s: true});
	const res = await get(human, url, '/something');
	t.is(res.text, 'Found. Redirecting to https://localhost:8086/something');
	t.is(res.status, 302);
	server.close();
});

test('cache results works correctly', async t => {
	const {server, url} = await listen('./fixture',	{h: 'localhost', p: port(), cache: true});
	const res = await get(bot, url, '/something');
	t.is(res.status, 200);
	t.false(Boolean(res.get('Expires')));
	const cachedRes = await get(bot, url, '/something');
	t.is(cachedRes.status, 200);
	t.true(Boolean(cachedRes.get('Expires')));
	server.close();
});

test('cache results respect TTL', async t => {
	const {server, url} = await listen('./fixture',	{h: 'localhost', p: port(), cache: true, cacheTTL: 1});
	const res = await get(bot, url, '/something');
	t.is(res.status, 200);
	t.false(Boolean(res.get('Expires')));
	await new Promise(resolve => setTimeout(resolve, 2000));
	const cachedRes = await get(bot, url, '/something');
	t.is(cachedRes.status, 200);
	t.false(Boolean(cachedRes.get('Expires')));
	server.close();
});
