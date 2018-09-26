const {resolve} = require('path');
const supertest = require('supertest');

const httpServer = require('./../src');

/**
 * Create the server.
 * @param {!Object} app The app.
 * @return {Promise<object>} Promise of the Server instance and the URL.
 */
exports.listen = async (folder, options) => {
	const correctFolder = folder ? resolve(__dirname, folder) : null;
	const server = await httpServer(correctFolder, {...options});
	return {
		server,
		url: `${options.ssl ? 'https://' : ''}${options.h}:${server.address().port}`
	};
};

/**
 * GET a URL with the given user agent.
 * @param {string} userAgent The user agent string.
 * @param {string} host The host part of the URL.
 * @param {string} path The path part of the URL.
 * @return {Promise<!Object>} Promise of the GET response.
 */
exports.get = (userAgent, host, path) =>
	supertest(host).get(path).set('User-Agent', userAgent);

exports.port = n => 8080 + Number(n);
