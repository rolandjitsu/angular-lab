import {env} from 'gulp-util';


export function providers() {
	let isSauce = false;
	const rawInput = env.browsers ? env.browsers : 'CHROME_TRAVIS_CI';
	const inputList = rawInput.replace(' ', '').split(',');
	let outputList = [];
	for (let i = 0; i < inputList.length; i++) {
		const input = inputList[i];
		if (CUSTOM_LAUNCHERS.hasOwnProperty(input)) {
			// Non-sauce browsers case.
			// Overrides everything,
			// ignore other options.
			outputList = [input];
			isSauce = false;
			break;
		} else if (CUSTOM_LAUNCHERS.hasOwnProperty(`SL_${input.toUpperCase()}`)) {
			isSauce = true;
			outputList.push(`SL_${input.toUpperCase()}`);
		} else if (SAUCE_ALIASES.hasOwnProperty(input.toUpperCase())) {
			outputList = outputList.concat(SAUCE_ALIASES[input]);
			isSauce = true;
		} else {
			throw new Error('Browser name(s) passed as option could not be found in CUSTOM_LAUNCHERS. Check available browsers in "browsers.config.js".');
		}
	}
	return {
		browsers: outputList.filter((item, pos, self) => self.indexOf(item) == pos),
		isSauce: isSauce
	}
}


export const SAUCE_ALIASES = {
	'ALL': Object.keys(CUSTOM_LAUNCHERS).filter(function (item) {
		return CUSTOM_LAUNCHERS[item].base == 'SauceLabs';
	}),
	'DESKTOP': ['SL_CHROME', 'SL_FIREFOX', 'SL_IE9', 'SL_IE10', 'SL_IE11', 'SL_EDGE', 'SL_SAFARI7', 'SL_SAFARI8', 'SL_SAFARI9'],
	'MOBILE': ['SL_ANDROID4.1', 'SL_ANDROID4.2', 'SL_ANDROID4.3', 'SL_ANDROID4.4', 'SL_ANDROID5', 'SL_IOS7', 'SL_IOS8', 'SL_IOS9'],
	'ANDROID': ['SL_ANDROID4.1', 'SL_ANDROID4.2', 'SL_ANDROID4.3', 'SL_ANDROID4.4', 'SL_ANDROID5'],
	'IE': ['SL_IE9', 'SL_IE10', 'SL_IE11'],
	'IOS': ['SL_IOS7', 'SL_IOS8', 'SL_IOS9'],
	'SAFARI': ['SL_SAFARI7', 'SL_SAFARI8', 'SL_SAFARI9'],
	'BETA': ['SL_CHROMEBETA', 'SL_FIREFOXBETA'],
	'DEV': ['SL_CHROMEDEV', 'SL_FIREFOXDEV'],
	'CI': [
		'SL_CHROME'
		// 'SL_SAFARI7',
		// 'SL_SAFARI8',
		// 'SL_SAFARI9',
		// 'SL_IOS7',
		// 'SL_IOS8',
		// 'SL_IOS9',
		// 'SL_FIREFOX',
		// 'SL_IE9',
		// 'SL_IE10',
		// 'SL_IE11',
		// 'SL_EDGE',
		// 'SL_ANDROID4.1',
		// 'SL_ANDROID4.2',
		// 'SL_ANDROID4.3',
		// 'SL_ANDROID4.4',
		// 'SL_ANDROID5.1'
	]
};

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
		version: '50'
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
		version: '45'
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
		browserName: 'MicrosoftEdge',
		platform: 'Windows 10',
		version: '13.10586'
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
	'SL_ANDROID5': {
		base: 'SauceLabs',
		browserName: 'android',
		platform: 'Linux',
		version: '5.1'
	}
};
