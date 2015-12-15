// Inspired by https://github.com/angular/angular/blob/master/karma-js.conf.js
import {SAUCE_LAUNCHERS} from './browsers.config.js';

let karmaConfig = {};
let sauceLabsConfig = {
	testName: 'NG2 Lab - UNIT',
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
	sauceLabsConfig.build = `TRAVIS #${process.env.TRAVIS_BUILD_NUMBER} (${process.env.TRAVIS_BUILD_ID})`;
	sauceLabsConfig.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;
	// TODO: remove once SauceLabs supports websockets.
	// This speeds up the capturing a bit, as browsers don't even try to use websocket.
	karmaConfig.transports = ['polling'];
}

Object.assign(karmaConfig, {
	frameworks: [
		'jasmine'
	],
	files: [
		'node_modules/core-js/client/shim.js',
		'node_modules/systemjs/dist/system.js', // Including systemjs because it defines `__eval`, which produces correct stack traces
		'node_modules/angular2/bundles/angular2-polyfills.js',
		'node_modules/angular2/bundles/angular2.dev.js',
		'node_modules/angular2/bundles/router.dev.js',
		'node_modules/angular2/bundles/http.dev.js',
		'node_modules/angular2/bundles/testing.dev.js',
		'bower_components/firebase/firebase-debug.js',
		// Sources and specs
		// Loaded through systemjs, in `test.js`
		{
			pattern: 'dist/public/**',
			included: false,
			watched: false
		},
		{
			pattern: 'dist/public/**/*.js',
			included: false,
			watched: true
		},
		'test.js'
	],
	exclude: [],
	customLaunchers: SAUCE_LAUNCHERS,
	browsers: [
		'Chrome'
	],
	plugins: [
		'karma-chrome-launcher',
		'karma-jasmine',
		'karma-sauce-launcher',
		'karma-sourcemap-loader'
	],
	preprocessors: {
		'**/*.js': ['sourcemap']
	},
	sauceLabs: sauceLabsConfig
});

module.exports = function (config) {
	config.set(karmaConfig);
};