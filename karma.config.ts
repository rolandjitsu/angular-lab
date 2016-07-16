const {CUSTOM_LAUNCHERS} = require('./browsers.config.js');

const karmaConfig: any = {};
const sauceLabs: any = {
	testName: 'NG2 Lab - UNIT',
	retryLimit: 3,
	startConnect: false,
	recordVideo: false,
	recordScreenshots: false,
	options:  {
		'selenium-version': '2.53.0',
		'command-timeout': 600,
		'idle-timeout': 600,
		'max-duration': 5400
	}
};

if (process.env.TRAVIS) {
	sauceLabs.build = `TRAVIS #${process.env.TRAVIS_BUILD_NUMBER} (${process.env.TRAVIS_BUILD_ID})`;
	sauceLabs.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;
	// TODO: remove once SauceLabs supports websockets.
	karmaConfig.transports = ['polling'];
}

module.exports = function (config) {
	config.set(Object.assign(karmaConfig, {
		frameworks: [
			'jasmine',
			'jspm'
		],
		reporters: [
			'spec'
		],
		jspm: {
			config: 'jspm.config.js',
			serveFiles: ['dist/app/**/*!(*.spec).js'],
			loadFiles: [
				// TODO: for A2 we need to run some test setup, figure out how to do it
				// 'test/setup.ts',
				'dist/app/**/*.spec.js'
			]
		},
		plugins: [
			'karma-chrome-launcher',
			'karma-jasmine',
			'karma-jspm',
			'karma-sauce-launcher',
			'karma-spec-reporter'
		],
		proxies: {
			'/jspm_packages/': '/base/jspm_packages/',
			'/dist/app/': '/base/dist/app/'
		},
		captureTimeout: 60000,
		browserDisconnectTimeout : 60000,
		browserDisconnectTolerance : 3,
		browserNoActivityTimeout : 60000,
		customLaunchers: CUSTOM_LAUNCHERS,
		sauceLabs,
		browsers: [
			'Chrome'
		]
	}));
};
