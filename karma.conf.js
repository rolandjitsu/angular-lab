module.exports = function (config) {
	config.set({
		frameworks: [
			'jasmine'
		],
		files: [
			// Sources and specs
			// Loaded through the systemjs, in `test.js`
			{
				pattern: 'dist/**',
				included: false,
				watched: false
			},
			// zone-microtask must be included first as it contains a Promise monkey patch
			'node_modules/zone.js/dist/zone-microtask.js',
			'node_modules/zone.js/dist/long-stack-trace-zone.js',
			'node_modules/zone.js/dist/jasmine-patch.js',
			'node_modules/traceur/bin/traceur-runtime.js',
			// Including systemjs because it defines `__eval`, which produces correct stack traces
			'node_modules/systemjs/dist/system.js',
			'node_modules/reflect-metadata/Reflect.js',
			'test.js'
		],
		exclude: [],
		customLaunchers: {
			// Use Chromium preinstalled with Travis VM
			// http://stackoverflow.com/questions/19255976/how-to-make-travis-execute-angular-tests-on-chrome-please-set-env-variable-chr
			CHROME_TRAVIS_CI: {
				base: 'Chrome',
				flags: [
					'--no-sandbox'
				]
			}
		},
		browsers: [
			'Chrome'
		]
	});
};