var yargs = require('yargs');
// Using Jasmine Spec Reporter
// https://github.com/bcaudan/jasmine-spec-reporter/blob/master/docs/protractor-configuration.md
var SpecReporter = require('jasmine-spec-reporter');

var argv = yargs
	.usage('NG2 Lab E2E test options.')
	.options({
		'browsers': {
			describe: 'Comma separated list of preconfigured browsers to use.',
			default: 'CHROME_DESKTOP'
		}
	})
	.help('help')
	.wrap(40)
	.argv

var BROWSERS = argv['browsers'].split(',');

var CHROME_OPTIONS = {
	'args': ['--js-flags=--expose-gc'],
	'perfLoggingPrefs': {
		'traceCategories': 'v8,blink.console,disabled-by-default-devtools.timeline,devtools.timeline'
	}
};

var BROWSER_CAPS = {
	CHROME_DESKTOP: {
		browserName: 'chrome',
		chromeOptions: CHROME_OPTIONS,
		loggingPrefs: {
			performance: 'ALL',
			browser: 'ALL'
		}
	},
	IPHONE_SIMULATOR: {
		browserName: 'MobileSafari',
		simulator: true,
		CFBundleName: 'Safari',
		device: 'iphone',
		instruments: 'true',
		loggingPrefs: {
			performance: 'ALL',
			browser: 'ALL'
		}
	},
	IPAD_NATIVE: {
		browserName: 'MobileSafari',
		simulator: false,
		CFBundleName: 'Safari',
		device: 'ipad',
		loggingPrefs: {
			performance: 'ALL',
			browser: 'ALL'
		}
	}
};

module.exports.config = {
	baseUrl: 'http://localhost:3000/',
	// restartBrowserBetweenTests: true, // add it back once https://github.com/angular/protractor/issues/1983 is fixed
	// Special option for Angular2, to test against all Angular2 applications on the page.
	// This means that Protractor will wait for every app to be stable before each action, and search within all apps when finding elements.
	useAllAngular2AppRoots: true,
	specs: [
		'dist/test/e2e/**/*.spec.js'
	],
	exclude: [],
	multiCapabilities: BROWSERS.map((browserName) => {
		var caps = BROWSER_CAPS[browserName];
		console.log(`Testing against: ${browserName}`);
		if (!caps) throw new Error(`There is no browser with name "${browserName};" configured.`);
		return caps;
	}),
	framework: 'jasmine',
	jasmineNodeOpts: {
		color: true,
		defaultTimeoutInterval: 60000,
		// Remove protractor dot reporter
		print: function () {}
	},
	onPrepare: function() {
		// Add jasmine spec reporter
		jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: 'all'}));
	},
	plugins: [
		{package: 'protractor-console-plugin'},
		{
			package: 'protractor-accessibility-plugin',
			chromeA11YDevTools: {
				treatWarningsAsFailures: true
			}
		}
	]
};