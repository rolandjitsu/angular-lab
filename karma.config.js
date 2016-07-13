const {CUSTOM_LAUNCHERS} = require('./browsers.config.js');

const karmaConfig = {};
const sauceLabsConfig = {
	testName: 'NG2 Lab - UNIT',
	startConnect: false,
	recordVideo: false,
	recordScreenshots: false,
	options:  {
		'selenium-version': '2.48.2',
		'command-timeout': 600,
		'idle-timeout': 600,
		'max-duration': 5400
	}
};

if (process.env.TRAVIS) {
	sauceLabsConfig.build = `TRAVIS #${process.env.TRAVIS_BUILD_NUMBER} (${process.env.TRAVIS_BUILD_ID})`;
	sauceLabsConfig.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;
	// If there are timeouts,
	// switch to ['pooling'].
	karmaConfig.transports = ['websocket'];
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
			serveFiles: ['tsconfig.json', 'src/app/**/*!(*.spec).ts', 'typings/**/*.d.ts'],
			loadFiles: [
				'test/setup.ts',
				'src/app/**/*.spec.ts'
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
			'/app/': '/base/app/',
			'/tsconfig.json': '/base/tsconfig.json',
			'/typings/': '/base/typings/'
		},
		customLaunchers: CUSTOM_LAUNCHERS,
		sauceLabs: sauceLabsConfig,
		browsers: [
			'Chrome'
		]
	}));
};
