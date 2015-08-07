/* global process */

// Inspired by https://github.com/angular/angular/blob/master/karma-js.conf.js

var sauceConf = require('./sauce.conf');

module.exports = function (config) {
	config.set({
		frameworks: [
			'jasmine'
		],
		files: [
			// zone-microtask must be included first as it contains a Promise monkey patch
			'node_modules/zone.js/dist/zone-microtask.js',
			'node_modules/zone.js/dist/long-stack-trace-zone.js',
			'node_modules/zone.js/dist/jasmine-patch.js',
			'node_modules/traceur/bin/traceur-runtime.js',
			// Including systemjs because it defines `__eval`, which produces correct stack traces
			'node_modules/systemjs/dist/system.js',
			'node_modules/reflect-metadata/Reflect.js',
			// Sources and specs
			// Loaded through the systemjs, in `test.js`
			{
				pattern: 'dist/**',
				included: false,
				watched: false
			},
			'test.js'
		],
		exclude: [],
		customLaunchers: sauceConf.launchers,
		browsers: [
			'Chrome'
		],
		sauceLabs: {
			testName: 'NG2 Play - UNIT',
			startConnect: false,
			recordVideo: false,
			recordScreenshots: false,
			options:  {
				'selenium-version': '2.45.0',
				'command-timeout': 600,
				'idle-timeout': 600,
				'max-duration': 5400
			}
		}
	});
	
	if (process.env.TRAVIS) {
		config.sauceLabs.build = 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')';
		config.sauceLabs.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;
	}
};