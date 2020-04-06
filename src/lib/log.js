'use strict';

const chalk = require('chalk');

const {log} = console;

module.exports = {
	info: message => log(chalk.bold.grey(message)),
	yellow: message => log(chalk.bold.yellow(message)),
	red: message => log(chalk.red(message)),
	cyan: message => log(chalk.cyan(message)),
	green: message => log(chalk.bold.green(message))
};
