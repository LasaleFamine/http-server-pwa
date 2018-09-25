# http-server-pwa aka pwa-server
[![Greenkeeper badge](https://badges.greenkeeper.io/LasaleFamine/http-server-pwa.svg)](https://greenkeeper.io/)

[![npm](https://img.shields.io/npm/v/http-server-pwa.svg?style=flat)](https://github.com/LasaleFamine/http-server-pwa) [![Build Status](https://travis-ci.org/LasaleFamine/http-server-pwa.svg?branch=master&style=flat)](https://travis-ci.org/LasaleFamine/http-server-pwa) [![Build status](https://ci.appveyor.com/api/projects/status/k5ssy06tt4ru1269?svg=true&style=flat)](https://ci.appveyor.com/project/LasaleFamine/http-server-pwa) [![codecov](https://codecov.io/gh/LasaleFamine/http-server-pwa/badge.svg?branch=master&style=flat)](https://codecov.io/gh/LasaleFamine/http-server-pwa?branch=master)

> http-server alike but for serving and rendering PWA: pwa-server

## What

This is a different version (btw inspired by) of the insta-ready [http-server](https://github.com/indexzero/http-server), but with some key features to render Progressive Web Apps (or also SPA) correctly for bots like `googlebot` or Facebook crawlers, so your application can be crawled with its content already loaded. This should avoid the killing problem of the SEO for PWAs.

**The server will render as normal, static ExpressJS server for your normal users.**

Worth noting is that the server supports the `history-fallback` behavior. You maybe can avoid that ***#*** (hash) for your PWA navigation ✌️.

## Features

The server is not "dependecies-free" like the original http-server and instead is powered by [ExpressJS](https://github.com/expressjs/express) under the hood and [Puppeter](https://github.com/GoogleChrome/puppeteer/) for render the pages to bots.

* [express-history-api-fallback](https://www.npmjs.com/package/express-history-api-fallback) - to fallback correctly to the `index.html`.
* [express-http-to-https](https://www.npmjs.com/package/express-http-to-https) - automatically redirect `http` requests to `https`.
* [devcert](https://github.com/davewasmer/devcert) - Create development certificate on the fly for local `https`. *NOTE: you could be prompted to insert your password before starting the server. This is necessary of using OpenSSL. More info on devcert repository.*
* [pupperender](https://github.com/LasaleFamine/pupperender) - Puppeter middleware to render correctly the PWA content for the crawlers.

## Production usage

The server will not create any SSL certificate on the fly when setting `process.env.NODE_ENV = production`.
You have two alternatives here:
- use [CloudFlare](https://cloudflare.com) free certification for your domain - easy peasy
- pass down your `.pem` KEY and CERT path inside your local/production system

## Usage

You can use it programmatically or as a [CLI](#CLI) tool (global or local).

## Install
> NOTE: *Node >= 8.x is required*

```
$ yarn add http-server-pwa
```

## Usage

```js
const httpServerPwa = require('http-server-pwa');

const server = await httpServerPwa('./dist', {p: 3000});
//=> Server started -> ./dist 0.0.0.0:3000
```

## API

### httpServerPwa(path, [options])

#### path

Type: `string`

Path to serve.

#### options

##### p|port

Type: `number`<br>
Default: `8080`

Port to use for running the server.

##### h|host

Type: `string`<br>
Default: `0.0.0.0`

Host to use for running the server.

##### f|fallback

Type: `string`<br>
Default: `index.html`

Fallback HTML file name.

##### s|https

Type: `boolean`<br>
Default: `false`

Enable HTTPS redirect on `localhost`.

##### pemKey

Type: `string`<br>
Default: `null`

Your `.pem` KEY file path for HTTPS during on production.

##### pemCert

Type: `string`<br>
Default: `null`

Your `.pem` CERT file path for HTTPS during on production.

##### d|debug

Type: `boolean`<br>
Default: `false`

If or not show some logs.


## CLI

```
$ yarn add --global http-server-pwa
```

```
$ http-server-pwa --help # or pwa-server --help

  Usage
	  $ http-server-pwa [path] [options]

	Options
		-p --port       Port to use [Default: 8080]
		-h --host       Host to use [Default: 0.0.0.0 | Windows: localhost]
		-f --fallback   Fallback HTML file name [Default: index.html]
		-d --debug      Be more verbose [Default: false]
		-s --https      Enable HTTPS redirect on localhost [Default: false]
		-h --help       Show this message

	Examples
	  $ http-server-pwa
	  Server started -> ./ 0.0.0.0:8080
	  $ http-server-pwa dist -p 3000
	  Server started -> ./dist 0.0.0.0:3000
```


## License

MIT © [LasaleFamine](https://godev.space)
