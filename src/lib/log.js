'use strict';

const chalk = require('chalk');

const log = console.log;

module.exports = {
	info: msg => log(chalk.bold.grey(msg)),
	yellow: msg => log(chalk.bold.yellow(msg)),
	red: msg => log(chalk.red(msg)),
	cyan: msg => log(chalk.cyan(msg)),
	green: msg => log(chalk.bold.green(msg))
};
