// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts
/* global jasmine */
const {SpecReporter} = require('jasmine-spec-reporter');

const {CUSTOM_LAUNCHERS} = require('./browsers.js');
const config = {};

const argv = require('yargs')
	.wrap(null)
	.usage('Angular Lab E2E test options. Usage: $0 --browsers CHROME_DESKTOP')
	.options({
		browsers: {
			describe: 'Comma separated list of preconfigured browsers to use.',
			default: 'CHROME_DESKTOP',
			type: 'string'
		}
	})
	.help('help')
	.argv;

const capabilities = Object.assign({
	CHROME_DESKTOP: {
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
	}
}, CUSTOM_LAUNCHERS);


// On Travis we use Saucelabs browsers.
if (process.env.TRAVIS) {
	Object.keys(capabilities)
		.forEach((key) => {
			capabilities[key].build = `TRAVIS #${process.env.TRAVIS_BUILD_NUMBER} (${process.env.TRAVIS_BUILD_ID})`;
			capabilities[key]['tunnel-identifier'] = process.env.TRAVIS_JOB_NUMBER;
			capabilities[key].name = 'E2E - Angular Lab';
		});

	config.sauceUser = process.env.SAUCE_USERNAME;
	config.sauceKey = process.env.SAUCE_ACCESS_KEY;
}


Object.assign(config, {
	allScriptsTimeout: 120000,
	specs: [
		'./e2e/**/*.e2e-spec.ts'
	],
	multiCapabilities: argv.browsers
		.split(',')
		.map((browser) => {
			const caps = capabilities[browser];
			console.log(`Testing against: ${browser}`);

			if (!caps) {
				throw new Error(`There is no browser with name "${browser};" configured.`);
			}
			return caps;
		}),
	// https://github.com/angular/protractor/blob/master/docs/server-setup.md#connecting-directly-to-browser-drivers
	directConnect: !process.env.TRAVIS,
	baseUrl: `http://localhost:4200/`,
	framework: 'jasmine',
	jasmineNodeOpts: {
		showColors: true,
		showTiming: true,
		defaultTimeoutInterval: 120000,
		print: () => {} // Remove protractor dot reporter
	},
	// Special option for Angular2, to test against all Angular2 applications on the page.
	// This means that Protractor will wait for every app to be stable before each action, and search within all apps when finding elements.
	rootElement: 'rj-lab',
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
	},
	plugins: [
		// For options see https://github.com/dequelabs/axe-webdriverjs#axebuilderoptionsoptionsobject.
		{
			package: 'protractor-accessibility-plugin',
			axe: {rules: require('./accessibility-rules.js')}
		},
		{
			package: 'protractor-console-plugin',
			failOnWarning: false,
			// TODO: Disable this until we can run a web server without livereload
			failOnError: false,
			logWarnings: false,
			exclude: [
				'info'
			]
		}
	]
});


module.exports = {
	config
};
