// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

/* global jasmine */
const SpecReporter = require('jasmine-spec-reporter');


exports.config = {
	allScriptsTimeout: 11000,
	specs: [
		'./e2e/**/*.e2e-spec.ts'
	],
	capabilities: {
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
	},
	directConnect: true,
	baseUrl: `http://localhost:4200/`,
	framework: 'jasmine',
	jasmineNodeOpts: {
		showColors: true,
		defaultTimeoutInterval: 30000,
		print: function () {} // Remove protractor dot reporter
	},
	// Special option for Angular2, to test against all Angular2 applications on the page.
	// This means that Protractor will wait for every app to be stable before each action, and search within all apps when finding elements.
	useAllAngular2AppRoots: true,
	onPrepare: function () {
		// Add jasmine spec reporter
		jasmine.getEnv()
			.addReporter(new SpecReporter({displayStacktrace: 'all'}));
		// Include jasmine expect
		require('jasmine-expect');
	},
	beforeLaunch: function () {
		require('ts-node').register({
			project: 'e2e'
		});
	},
	plugins: [
		{
			package: 'protractor-accessibility-plugin',
			chromeA11YDevTools: {
				treatWarningsAsFailures: true
			}
		},
		{
			package: 'protractor-console-plugin',
			failOnWarning: false,
			failOnError: true,
			logWarnings: true,
			exclude: [
				'info'
			]
		}
	]
};
