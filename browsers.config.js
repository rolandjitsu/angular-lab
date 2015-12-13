export const CUSTOM_LAUNCHERS = {
	// Use Chromium preinstalled with Travis VM
	// http://stackoverflow.com/questions/19255976/how-to-make-travis-execute-angular-tests-on-chrome-please-set-env-variable-chr
	'CHROME_TRAVIS_CI': {
		base: 'Chrome',
		flags: [
			'--no-sandbox'
		]
	},
	'SL_CHROME': {
		base: 'SauceLabs',
		browserName: 'chrome',
		version: '46'
	},
	'SL_CHROMEBETA': {
		base: 'SauceLabs',
		browserName: 'chrome',
		version: 'beta'
	},
	'SL_CHROMEDEV': {
		base: 'SauceLabs',
		browserName: 'chrome',
		version: 'dev'
	},
	'SL_FIREFOX': {
		base: 'SauceLabs',
		browserName: 'firefox',
		version: '42'
	},
	'SL_FIREFOXBETA': {
		base: 'SauceLabs',
		browserName: 'firefox',
		version: 'beta'
	},
	'SL_FIREFOXDEV': {
		base: 'SauceLabs',
		browserName: 'firefox',
		version: 'dev'
	},
	'SL_SAFARI7': {
		base: 'SauceLabs',
		browserName: 'safari',
		platform: 'OS X 10.9',
		version: '7'
	},
	'SL_SAFARI8': {
		base: 'SauceLabs',
		browserName: 'safari',
		platform: 'OS X 10.10',
		version: '8'
	},
	'SL_SAFARI9': {
		base: 'SauceLabs',
		browserName: 'safari',
		platform: 'OS X 10.11',
		version: '9.0'
	},
	'SL_IOS7': {
		base: 'SauceLabs',
		browserName: 'iphone',
		platform: 'OS X 10.10',
		version: '7.1'
	},
	'SL_IOS8': {
		base: 'SauceLabs',
		browserName: 'iphone',
		platform: 'OS X 10.10',
		version: '8.4'
	},
	'SL_IOS9': {
		base: 'SauceLabs',
		browserName: 'iphone',
		platform: 'OS X 10.10',
		version: '9.1'
	},
	'SL_IE9': {
		base: 'SauceLabs',
		browserName: 'internet explorer',
		platform: 'Windows 2008',
		version: '9'
	},
	'SL_IE10': {
		base: 'SauceLabs',
		browserName: 'internet explorer',
		platform: 'Windows 2012',
		version: '10'
	},
	'SL_IE11': {
		base: 'SauceLabs',
		browserName: 'internet explorer',
		platform: 'Windows 8.1',
		version: '11'
	},
	'SL_EDGE': {
		base: 'SauceLabs',
		browserName: 'microsoftedge',
		platform: 'Windows 10',
		version: '20.10240'
	},
	'SL_ANDROID4.1': {
		base: 'SauceLabs',
		browserName: 'android',
		platform: 'Linux',
		version: '4.1'
	},
	'SL_ANDROID4.2': {
		base: 'SauceLabs',
		browserName: 'android',
		platform: 'Linux',
		version: '4.2'
	},
	'SL_ANDROID4.3': {
		base: 'SauceLabs',
		browserName: 'android',
		platform: 'Linux',
		version: '4.3'
	},
	'SL_ANDROID4.4': {
		base: 'SauceLabs',
		browserName: 'android',
		platform: 'Linux',
		version: '4.4'
	},
	'SL_ANDROID5.1': {
		base: 'SauceLabs',
		browserName: 'android',
		platform: 'Linux',
		version: '5.1'
	}
};

export const SAUCE_ALIASES = {
	'ALL': Object.keys(CUSTOM_LAUNCHERS).filter(function (item) {
		return CUSTOM_LAUNCHERS[item].base == 'SauceLabs';
	}),
	'DESKTOP': ['SL_CHROME', 'SL_FIREFOX', 'SL_IE9', 'SL_IE10', 'SL_IE11', 'SL_EDGE', 'SL_SAFARI7', 'SL_SAFARI8'],
	'MOBILE': ['SL_ANDROID4.1', 'SL_ANDROID4.2', 'SL_ANDROID4.3', 'SL_ANDROID4.4', 'SL_ANDROID5.1', 'SL_IOS7', 'SL_IOS8', 'SL_IOS9'],
	'ANDROID': ['SL_ANDROID4.1', 'SL_ANDROID4.2', 'SL_ANDROID4.3', 'SL_ANDROID4.4', 'SL_ANDROID5.1'],
	'IE': ['SL_IE9', 'SL_IE10', 'SL_IE11'],
	'IOS': ['SL_IOS7', 'SL_IOS8', 'SL_IOS9'],
	'SAFARI': ['SL_SAFARI7', 'SL_SAFARI8', 'SL_SAFARI9'],
	'BETA': ['SL_CHROMEBETA', 'SL_FIREFOXBETA'],
	'DEV': ['SL_CHROMEDEV', 'SL_FIREFOXDEV'],
	'CI': [
		'SL_CHROME',
		'SL_SAFARI7',
		'SL_SAFARI8',
		'SL_SAFARI9',
		// 'SL_IOS7',
		'SL_IOS8',
		'SL_IOS9',
		// 'SL_FIREFOX',
		// 'SL_IE9',
		// 'SL_IE10',
		// 'SL_IE11',
		// 'SL_EDGE',
		// 'SL_ANDROID4.1',
		// 'SL_ANDROID4.2',
		// 'SL_ANDROID4.3',
		// 'SL_ANDROID4.4',
		'SL_ANDROID5.1'
	]
};