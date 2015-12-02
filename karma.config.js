// Inspired by https://github.com/angular/angular/blob/master/karma-js.conf.js
import {SAUCE_LAUNCHERS} from './sauce.config';

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
		'node_modules/es6-shim/es6-shim.js',
		'node_modules/systemjs/dist/system.src.js', // Including systemjs because it defines `__eval`, which produces correct stack traces
		'node_modules/angular2/bundles/angular2.dev.js',
		'node_modules/angular2/bundles/router.dev.js',
		'node_modules/angular2/bundles/http.dev.js',
		'node_modules/angular2/bundles/testing.js',
		'bower_components/firebase/firebase.js',
		// Sources and specs
		// Loaded through systemjs, in `test.js`
		{
			pattern: 'dist/app/**',
			included: false,
			watched: false
		},
		{
			pattern: 'dist/app/**/*.js',
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
	sauceLabs: sauceLabsConfig 
});

module.exports = function (config) {
	config.set(karmaConfig);
};