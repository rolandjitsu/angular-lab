// Protractor configuration file,
// see link for more information https://github.com/angular/protractor/blob/master/lib/config.ts
const {SpecReporter} = require('jasmine-spec-reporter');


const config = {};
const capabilities = {
	browserName: 'chrome',
	chromeOptions: {
		'args': ['--js-flags=--expose-gc'],
		'perfLoggingPrefs': {
			'traceCategories': 'v8,blink.console,disabled-by-default-devtools.timeline,devtools.timeline'
		}
	},
	loggingPrefs: {
		performance: 'ALL',
		browser: 'ALL'
	}
};


// On Travis we use Saucelabs browsers.
if (process.env.TRAVIS) {
	capabilities.build = `TRAVIS #${process.env.TRAVIS_BUILD_NUMBER} (${process.env.TRAVIS_BUILD_ID})`;
	capabilities['tunnel-identifier'] = process.env.TRAVIS_JOB_NUMBER;
	capabilities.name = 'E2E - Angular Lab';

	config.sauceUser = process.env.SAUCE_USERNAME;
	config.sauceKey = process.env.SAUCE_ACCESS_KEY;
}


Object.assign(config, {
	capabilities,
	allScriptsTimeout: 120000,
	specs: [
		'./e2e/**/*.e2e-spec.ts'
	],
	// https://github.com/angular/protractor/blob/master/docs/server-setup.md#connecting-directly-to-browser-drivers
	directConnect: !process.env.TRAVIS,
	baseUrl: 'http://localhost:4224/',
	framework: 'jasmine',
	jasmineNodeOpts: {
		showColors: true,
		showTiming: true,
		defaultTimeoutInterval: 120000,
		print: () => {}
	},
	// Option for Angular to test against Angular 2+ applications on the page.
	// Protractor will wait for the app to be stable before each action, and search within all apps when finding elements.
	rootElement: 'rj-app',
	onPrepare: () => {
		// Add jasmine spec reporter
		jasmine.getEnv()
			.addReporter(new SpecReporter({spec: {displayStacktrace: true}}));
		// Include jasmine expect
		require('jasmine-expect');
		// Transpile all TS to JS
		require('ts-node')
			.register({
				project: 'e2e/tsconfig.e2e.json'
			});
	}
});


module.exports = {
	config
};
