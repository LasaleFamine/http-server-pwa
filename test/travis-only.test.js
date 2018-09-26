'use strict';

const test = require('ava');

const {listen, get, port} = require('./helpers');

const human = 'Chrome';

// Avoiding errors of untrusted CA: http://stackoverflow.com/questions/22654479/nodejs-https-api-testing-with-mocha-and-super-test-depth-zero-self-signed-cert
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

test.serial('enable https devcert on develpment', async t => {
	const {server, url} = await listen(
		'./fixture',	{h: 'localhost', p: port(7), ssl: true}
	);
	const res = await get(human, url, '/something');
	t.is(res.text, 'some\n');
	server.close();
});

test.serial('not create a dev certificate on production also with ssl specified', async t => {
	process.env.NODE_ENV = 'production';
	const {server, url} = await listen(
		'./fixture',	{h: 'localhost', p: port(8), ssl: true}
	);
	const res = await t.throws(get(human, url, '/something'));
	t.is(res.code, 'ECONNRESET');

	const resHTTP = await get(human, url.replace('https', 'http'), '/something');
	t.is(resHTTP.text, 'some\n');

	server.close();
});
