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

* [pupperender](https://github.com/LasaleFamine/pupperender) - Puppeter middleware to render correctly the PWA content for the crawlers.
* [express-history-api-fallback](https://www.npmjs.com/package/express-history-api-fallback) - to fallback correctly to the `index.html`.
* [express-http-to-https](https://www.npmjs.com/package/express-http-to-https) - automatically redirect `http` requests to `https`.
* [devcert](https://github.com/davewasmer/devcert) - Create development certificate on the fly for local `https`. **NOTE: you could be prompted to insert your password before starting the server. This is necessary of using OpenSSL. More info on devcert repository.**

## Production usage

The server will not create any SSL certificate on the fly when you set `process.env.NODE_ENV = production` even if `--ssl` flag is passed down.
You have two alternatives here:
- use a reverse proxy like [CloudFlare](https://cloudflare.com) and get free certification for your domain - easy peasy
- use a custom reverse proxy like Nginx and load your certification from there

I currently don't want to support a custom certificate load. PR are always welcome.

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
//=> Server started -> ./dist localhost:3000
```

## Deploy on Heroku

In order to make the server work as expected on Heroku services (even on free tier) you must add [the puppeteer-heroku-buildpack](https://github.com/jontewks/puppeteer-heroku-buildpack).

Since recent changes on the platform it is **strongly** suggested to add it from source rather than the buildpack's catalogs.

```bash
$ heroku buildpacks:set https://github.com/jontewks/puppeteer-heroku-buildpack.git
```

## API

### httpServerPwa(path, [options])

#### path

Type: `string`

Path to serve.

#### options

| Name | CLI flag | Type | Default | Description |
|------|--------------|------|---------|-------------|
| port | p | `number` | `8080` | Port to use for running the server. |
| host | h | `string` | `localhost` | Host to use for running the server. |
| fallback | f | `string` | `index.html` | Fallback HTML file name. |
| https | s | `boolean` | `false` | Enable HTTPS redirect on `localhost`.|
| ssl |  | `boolean` | `false` | Enable `devcert` auto-generation of SSL certification for development.|
| debug | d | `boolean` | `false` | If or not show some logs.|

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
		-h --host       Host to use [Default: localhost | Windows: 127.0.0.1]
		-f --fallback   Fallback HTML file name [Default: index.html]
		-d --debug      Be more verbose [Default: false]
		--ssl           Auto-generation SSL certificate during development [Default: false]
		-h --help       Show this message

	Examples
	  $ http-server-pwa
	  Server started -> ./ localhost:8080
	  $ http-server-pwa dist -p 3000
	  Server started -> ./dist localhost:3000
```


## License

MIT © [LasaleFamine](https://godev.space)
