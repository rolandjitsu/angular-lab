// Inspired by https://github.com/angular/angular/blob/master/karma-js.conf.js

import { SAUCE_LAUNCHERS } from './sauce.conf';

let sauceLabsConfig = {
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
};

if (process.env.TRAVIS) {
	sauceLabsConfig.build = 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')';
	sauceLabsConfig.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;
}

export default function (config) {
	config.set({
		frameworks: [
			'jasmine'
		],
		files: [
			'node_modules/traceur/bin/traceur-runtime.js',
			'node_modules/systemjs/dist/system.js', // Including systemjs because it defines `__eval`, which produces correct stack traces
			'node_modules/angular2/bundles/angular2.js',
			'node_modules/angular2/bundles/router.dev.js',
			'node_modules/angular2/node_modules/zone.js/dist/jasmine-patch.js',
			'node_modules/angular2/bundles/http.js',
			'node_modules/angular2/bundles/test_lib.dev.js',
			// Sources and specs
			// Loaded through systemjs, in `test.js`
			{
				pattern: 'dist/**',
				included: false,
				watched: false
			},
			'test.js'
		],
		exclude: [],
		customLaunchers: SAUCE_LAUNCHERS,
		browsers: [
			'Chrome'
		],
		sauceLabs: sauceLabsConfig 
	});
};