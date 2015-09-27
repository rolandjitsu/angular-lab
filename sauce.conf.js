export const SAUCE_LAUNCHERS = {
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
		version: '44'
	},
	'SL_CHROME_BETA': {
		base: 'SauceLabs',
		browserName: 'chrome',
		version: 'beta'
	},
	'SL_CHROME_DEV': {
		base: 'SauceLabs',
		browserName: 'chrome',
		version: 'dev'
	},
	'SL_FIREFOX': {
		base: 'SauceLabs',
		browserName: 'firefox',
		version: '37'
	},
	'SL_FIREFOX_BETA': {
		base: 'SauceLabs',
		browserName: 'firefox',
		version: 'beta'
	},
	'SL_FIREFOX_DEV': {
		base: 'SauceLabs',
		browserName: 'firefox',
		version: 'dev'
	},
	'SL_SAFARI_7': {
		base: 'SauceLabs',
		browserName: 'safari',
		platform: 'OS X 10.9',
		version: '7'
	},
	'SL_SAFARI_8': {
		base: 'SauceLabs',
		browserName: 'safari',
		platform: 'OS X 10.10',
		version: '8'
	},
	'SL_IOS_7': {
		base: 'SauceLabs',
		browserName: 'iphone',
		platform: 'OS X 10.10',
		version: '7.1'
	},
	'SL_IOS_8': {
		base: 'SauceLabs',
		browserName: 'iphone',
		platform: 'OS X 10.10',
		version: '8.4'
	},
	'SL_IE_9': {
		base: 'SauceLabs',
		browserName: 'internet explorer',
		platform: 'Windows 2008',
		version: '9'
	},
	'SL_IE_10': {
		base: 'SauceLabs',
		browserName: 'internet explorer',
		platform: 'Windows 2012',
		version: '10'
	},
	'SL_IE_11': {
		base: 'SauceLabs',
		browserName: 'internet explorer',
		platform: 'Windows 8.1',
		version: '11'
	},
	'SL_EDGE': {
		base: 'SauceLabs',
		browserName: 'microsoftedge',
		platform: 'Windows 10'
	},
	'SL_ANDROID_4.0': {
		base: 'SauceLabs',
		browserName: 'android',
		platform: 'Linux',
		version: '4.0'
	},
	'SL_ANDROID_4.1': {
		base: 'SauceLabs',
		browserName: 'android',
		platform: 'Linux',
		version: '4.1'
	},
	'SL_ANDROID_4.2': {
		base: 'SauceLabs',
		browserName: 'android',
		platform: 'Linux',
		version: '4.2'
	},
	'SL_ANDROID_4.3': {
		base: 'SauceLabs',
		browserName: 'android',
		platform: 'Linux',
		version: '4.3'
	},
	'SL_ANDROID_4.4': {
		base: 'SauceLabs',
		browserName: 'android',
		platform: 'Linux',
		version: '4.4'
	},
	'SL_ANDROID_5.1': {
		base: 'SauceLabs',
		browserName: 'android',
		platform: 'Linux',
		version: '5.1'
	}
};

export const SAUCE_ALIASES = {
	'ALL': Object.keys(SAUCE_LAUNCHERS).filter(function (item) {
		return SAUCE_LAUNCHERS[item].base == 'SauceLabs';
	}),
	'DESKTOP': ['SL_CHROME', 'SL_FIREFOX', 'SL_IE_9', 'SL_IE_10', 'SL_IE_11', 'SL_EDGE', 'SL_SAFARI_7', 'SL_SAFARI_8'],
	'MOBILE': ['SL_ANDROID_4.0', 'SL_ANDROID_4.1', 'SL_ANDROID_4.2', 'SL_ANDROID_4.3', 'SL_ANDROID_4.4', 'SL_ANDROID_5.1', 'SL_IOS_7', 'SL_IOS_8'],
	'ANDROID': ['SL_ANDROID_4.0', 'SL_ANDROID_4.1', 'SL_ANDROID_4.2', 'SL_ANDROID_4.3', 'SL_ANDROID_4.4', 'SL_ANDROID_5.1'],
	'IE': ['SL_IE_9', 'SL_IE_10', 'SL_IE_11'],
	'IOS': ['SL_IOS_7', 'SL_IOS_8'],
	'SAFARI': ['SL_SAFARI_7', 'SL_SAFARI_8'],
	'BETA': ['SL_CHROME_BETA', 'SL_FIREFOX_BETA'],
	'DEV': ['SL_CHROME_DEV', 'SL_FIREFOX_DEV'],
	'CI': [
		'SL_CHROME'
		// 'SL_SAFARI_7',
		// 'SL_SAFARI_8',
		// 'SL_IOS_7',
		// 'SL_IOS_8',
		// 'SL_FIREFOX',
		// 'SL_IE_9',
		// 'SL_IE_10',
		// 'SL_IE_11',
		// 'SL_EDGE',
		// 'SL_ANDROID_4.1',
		// 'SL_ANDROID_4.2',
		// 'SL_ANDROID_4.3',
		// 'SL_ANDROID_4.4',
		// 'SL_ANDROID_5.1'
	]
};