/// <reference path="tsd_typings/angular-protractor/angular-protractor.d.ts"/>

var argv = require('yargs')
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

var browsers = argv['browsers'].split(',');

var CHROME_OPTIONS = {
	'args': ['--js-flags=--expose-gc'],
	'perfLoggingPrefs': {
		'traceCategories': 'v8,blink.console,disabled-by-default-devtools.timeline,devtools.timeline'
	}
};

var CHROME_MOBILE_EMULATION = {
	// Can't use 'deviceName':'Google Nexus 7 2'
	// as this would yield wrong orientation,
	// so we specify facts explicitly
	'deviceMetrics': {
		'width': 600,
		'height': 960,
		'pixelRatio': 2
	}
};

var BROWSER_CAPS = {
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

exports.config = {
	baseUrl: 'http://localhost:8000/',
	// restartBrowserBetweenTests: true,
	onPrepare: function () {
		// remove this hack and use the config option
		// restartBrowserBetweenTests once that is not hanging.
		// See https://github.com/angular/protractor/issues/1983
		patchProtractorWait(browser);
	},
	specs: [
		'dist/**/*.e2e.js'
	],
	exclude: [],
	multiCapabilities: browsers.map(function (browserName) {
		var caps = BROWSER_CAPS[browserName];
		console.log('Testing against', browserName);
		if (!caps) throw new Error('Not configured browser name: '+browserName);
		return caps;
	}),
	framework: 'jasmine2',
	jasmineNodeOpts: {
		showColors: true,
		defaultTimeoutInterval: 60000
	}
};


// Disable waiting for Angular as there isn't an integration layer yet.
// Wait for a proper debugging API implementation for Ng2.0, remove this here
// and the sleeps in all tests.
function patchProtractorWait (browser) {
	browser.ignoreSynchronization = true;
	var _get = browser.get;
	var sleepInterval = process.env.TRAVIS ? 14000 : 8000;
	browser.get = function () {
		var result = _get.apply(this, arguments);
		browser.driver.wait(protractor.until.elementLocated(By.js('var cs = document.body.children; var isLoading = false; for (var i = 0; i < cs.length; i++) {if (cs[i].textContent.indexOf("Loading...") > -1) isLoading = true; } return !isLoading ? document.body.children : null')), sleepInterval);
		return result;
	}
}

function merge (src, target) {
	for (var prop in src) target[prop] = src[prop];
	return target;
}