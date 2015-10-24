import yargs from 'yargs';

let argv = yargs
	.usage('NG Lab E2E test options.')
	.options({
		'browsers': {
			describe: 'Comma separated list of preconfigured browsers to use.',
			default: 'ChromeDesktop'
		}
	})
	.help('help')
	.wrap(40)
	.argv

let browsers = argv['browsers'].split(',');

const CHROME_OPTIONS = {
	'args': ['--js-flags=--expose-gc'],
	'perfLoggingPrefs': {
		'traceCategories': 'v8,blink.console,disabled-by-default-devtools.timeline,devtools.timeline'
	}
};

const BROWSER_CAPS = {
	ChromeDesktop: {
		browserName: 'chrome',
		chromeOptions: CHROME_OPTIONS,
		loggingPrefs: {
			performance: 'ALL',
			browser: 'ALL'
		}
	},
	IPhoneSimulator: {
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
	IPadNative: {
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

let config = {
	baseUrl: 'http://localhost:3000/',
	// restartBrowserBetweenTests: true, // add it back once https://github.com/angular/protractor/issues/1983 is fixed
	// This means that Protractor will wait for every app to be stable before each action, and search within all apps when finding elements.
	// useAllAngular2AppRoots: true,
	// Special option for Angular2, to test against all Angular2 applications on the page.
	rootElement: 'app',
	specs: [
		'dist/**/*.e2e.js'
	],
	exclude: [],
	multiCapabilities: browsers.map((browserName) => {
		let caps = BROWSER_CAPS[browserName];
		console.log('Testing against', browserName);
		if (!caps) throw new Error(`Not configured browser name: ${browserName}`);
		return caps;
	}),
	framework: 'jasmine2',
	jasmineNodeOpts: {
		showColors: true,
		defaultTimeoutInterval: 60000
	}
};

export { config };