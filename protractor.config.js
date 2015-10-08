import yargs from 'yargs';

let argv = yargs
	.usage('Angular e2e test options.')
	.options({
		'browsers': {
			describe: 'Comma separated list of preconfigured browsers to use.',
			default: 'ChromeDesktop'
		}
	})
	.help('ng-help')
	.wrap(40)
	.argv

let browsers = argv['browsers'].split(',');

const CHROME_OPTIONS = {
	'args': ['--js-flags=--expose-gc'],
	'perfLoggingPrefs': {
		'traceCategories': 'v8,blink.console,disabled-by-default-devtools.timeline,devtools.timeline'
	}
};

const CHROME_MOBILE_EMULATION = {
	// Can't use 'deviceName':'Google Nexus 7 2'
	// as this would yield wrong orientation,
	// so we specify facts explicitly
	'deviceMetrics': {
		'width': 600,
		'height': 960,
		'pixelRatio': 2
	}
};

const BROWSER_CAPS = {
	ChromeDesktop: {
		browserName: 'chrome',
		chromeOptions: merge(CHROME_OPTIONS, {
			// TODO(tbosch): when we are using mobile emulation on
			// chrome 44.0 beta, clicks are no more working.
			// see https://github.com/angular/angular/issues/2309
			// 'mobileEmulation': CHROME_MOBILE_EMULATION
		}),
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
	baseUrl: 'http://localhost:8000/',
	// restartBrowserBetweenTests: true,
	onPrepare: () => {
		// remove this hack and use the config option
		// restartBrowserBetweenTests once that is not hanging.
		// See https://github.com/angular/protractor/issues/1983
		patchProtractorWait(browser);
	},
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


// Disable waiting for Angular as there isn't an integration layer yet.
// Wait for a proper debugging API implementation for Ng2.0, remove this here
// and the sleeps in all tests.
function patchProtractorWait (browser) {
	browser.ignoreSynchronization = true;
	// Benchmarks never need to wait for Angular 2 to be ready
	let _get = browser.get;
	let sleepInterval = process.env.TRAVIS ? 14000 : 8000;
	browser.get = () => {
		let result = _get.apply(this, arguments);
		browser.driver.wait(
			protractor.until.elementLocated(By.js(() => {
				let isLoading = true;
				if (window.getAllAngularTestabilities) {
					let testabilities = window.getAllAngularTestabilities();
					if (testabilities && testabilities.length > 0) {
						isLoading = false;
						testabilities.forEach((testability) => {
							if (!testability.isStable()) isLoading = true;
						});
					}
				}
				return !isLoading ? document.body.children : null;
			})),
			sleepInterval
		);
		return result;
	}
}

function merge (src, target) {
	for (let prop in src) target[prop] = src[prop];
	return target;
}