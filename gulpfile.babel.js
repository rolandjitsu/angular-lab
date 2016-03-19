import autoprefixer from 'gulp-autoprefixer';
import changed from 'gulp-changed';
import {create as createBrowserSyncServer} from 'browser-sync';
import {colors, env, log} from 'gulp-util';
import {exec, spawn} from 'child_process';
import del from 'del';
import gulp from 'gulp';
import karma from 'karma';
import open from 'open';
import plumber from 'gulp-plumber';
import sauceConnectLauncher from 'sauce-connect-launcher';
import sass from 'gulp-sass';
import size from 'gulp-size';
import sourcemaps from 'gulp-sourcemaps';
import split from 'split2';
import tslint from 'gulp-tslint';
import typescript from 'gulp-typescript';

const bs = createBrowserSyncServer('NG2 Lab');

import {
	CUSTOM_LAUNCHERS,
	SAUCE_ALIASES
} from './browsers.config';
const KARMA_CONFIG = {configFile: `${__dirname}/karma.config.js`};
const BS_CONFIG = require('./bs.config');
const GULP_SIZE_DEFAULT_CONFIG = {
	showFiles: true,
	gzip: false
};

const PATHS = {
	typings: [
		'typings/main.d.ts'
	],
	tests: {
		root: 'test',
		ts: [
			'test/**/*.ts'
		]
	},
	src: {
		root: 'src',
		static: 'src/**/*.{svg,jpg,png,ico,txt}',
		ts: [
			'src/**/*.ts'
		],
		html: 'src/**/*.html',
		scss: [
			'!src/app/vars.scss',
			'!src/app/mixins.scss',
			'src/**/*.scss'
		]
	},
	dist: {
		root: 'dist',
		public: 'dist/public',
		test: 'dist/test'
	}
};


/**
 * Start a web server using BS
 * See https://www.browsersync.io/docs
 */

gulp.task(function server(done) {
	// For more BS options,
	// check http://www.browsersync.io/docs/options/
	bs.init(BS_CONFIG, done);
	// When process exits kill browser-sync server
	process.on('exit', () => {
		bs.exit();
	});
});


/**
 * Copy JSPM assets
 */

gulp.task('deps/jspm:packages', function () {
	const JSPM_PACKAGES_DIST_PATH = `${PATHS.dist.public}/jspm_packages`;
	return gulp
		.src([
			'jspm_packages/**/.*',
			'jspm_packages/**/*'
		])
		.pipe(changed(JSPM_PACKAGES_DIST_PATH))
		.pipe(size(GULP_SIZE_DEFAULT_CONFIG))
		.pipe(gulp.dest(JSPM_PACKAGES_DIST_PATH));
});

// TODO: add watch for package.json and the jspm config and rerun the deps task if there is a change
gulp.task('deps/jspm:config', function () {
	return gulp
		.src([
			`${PATHS.src.root}/jspm.browser.js`,
			`${PATHS.src.root}/jspm.config.js`
		])
		.pipe(changed(PATHS.dist.public))
		.pipe(size(GULP_SIZE_DEFAULT_CONFIG))
		.pipe(gulp.dest(PATHS.dist.public));
});

gulp.task('deps', gulp.parallel(
	'deps/jspm:packages',
	'deps/jspm:config'
));


/**
 * Copy static assets
 */

gulp.task('serve/static', function () {
	return gulp
		.src(PATHS.src.static)
		.pipe(changed(PATHS.dist.public))
		.pipe(size(GULP_SIZE_DEFAULT_CONFIG))
		.pipe(gulp.dest(PATHS.dist.public))
		.pipe(bs.stream());
});


/**
 * Copy HTML
 */

gulp.task('serve/html', function () {
	return gulp
		.src(PATHS.src.html)
		.pipe(changed(PATHS.dist.public))
		.pipe(size(GULP_SIZE_DEFAULT_CONFIG))
		.pipe(gulp.dest(PATHS.dist.public))
		.pipe(bs.stream());
});


/**
 * Build JS
 */

gulp.task('build/js:tests', function () {
	return buildJs(
		[].concat(PATHS.typings, PATHS.tests.ts),
		PATHS.dist.test,
		PATHS.tests.root
	);
});

gulp.task('build/js:app', function () {
	let stream = buildJs(
		[].concat(PATHS.typings, PATHS.src.ts),
		PATHS.dist.public,
		PATHS.src.root
	);
	return stream.pipe(
		bs.stream({match: "**/*.js"})
	);
});

gulp.task('build/js', gulp.parallel(
	'build/js:tests',
	'build/js:app'
));

function buildJs(src, dest, base = './', options = {}) {
	return gulp
		.src(src, {base: base})
		.pipe(changed(dest, {extension: '.js'}))
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(typescript(typescript.createProject('tsconfig.json', Object.assign(options, {
			typescript: require('typescript')
		}))))
		.js
		.pipe(sourcemaps.write('.'))
		.pipe(size(GULP_SIZE_DEFAULT_CONFIG))
		.pipe(gulp.dest(dest));
}


/**
 * Build SCSS
 */

gulp.task('build/css', function () {
	return gulp
		.src(PATHS.src.scss)
		.pipe(changed(PATHS.dist.public, {extension: '.css'}))
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass({
			includePaths: [
				`${PATHS.src.root}/app`
			],
			outputStyle: 'compressed', // nested (default), expanded, compact, compressed
			indentType: 'tab',
			indentWidth: 1,
			linefeed: 'lf'
		}))
		.on('error', sass.logError)
		.pipe(autoprefixer())
		.pipe(sourcemaps.write('.'))
		.pipe(size(GULP_SIZE_DEFAULT_CONFIG))
		.pipe(gulp.dest(PATHS.dist.public))
		.pipe(bs.stream({match: "**/*.css"}));
});


/**
 * Build everything
 */

gulp.task('build', gulp.parallel(
	'deps',
	'serve/static',
	'serve/html',
	'build/js',
	'build/css'
));


/**
 * Check code integrity (lint)
 * `tslint.json` contains enabled rules.
 * See https://github.com/palantir/tslint#supported-rules for more rules.
 */

gulp.task(function lint(done) {
	return gulp
		.src([].concat(PATHS.tests.ts, PATHS.src.ts))
		.pipe(plumber())
		.pipe(tslint({
			tslint: require('tslint') // Use a different version of tslint
		}))
		.pipe(tslint.report('verbose', {
			summarizeFailureOutput: true,
			emitError: true
		}))
		.on('error', (error) => done(error));
});


/**
 * Unit Tests
 */

// On the CI we build everything once before any tests are ran, so we do not need to run a build here
gulp.task('test/unit:ci', function (done) {
	const BROWSER_CONF = getBrowsersConfigFromCLI();
	const CONFIG = Object.assign({}, KARMA_CONFIG, {
		browsers: BROWSER_CONF.browsers,
		singleRun: true,
		reporters: [
			'dots'
		]
	});
	createKarmaServer(CONFIG, (err) => {
		done();
		process.exit(err ? 1 : 0);
	});
});

gulp.task('test/unit:ci/sauce', function (done) {
	const CONFIG = Object.assign({}, KARMA_CONFIG, {
		browsers: SAUCE_ALIASES.CI,
		singleRun: true,
		browserNoActivityTimeout: 240000,
		captureTimeout: 120000,
		reporters: [
			'dots',
			'saucelabs'
		]
	});
	createKarmaServer(CONFIG, (err) => {
		done();
		process.exit(err ? 1 : 0);
	});
});

// Locally we need to run a build before we run any tests
gulp.task('test/unit:continuous', gulp.series('build', function run(done) {
	createKarmaServer(KARMA_CONFIG, done);
	// TODO: compile specs and required files at runtime
	// createJsBuildServer();
}));

// Run unit tests once
gulp.task('test/unit:single', gulp.series('build', function run(done) {
	const CONFIG = Object.assign({}, KARMA_CONFIG, {
		singleRun: true
	});
	createKarmaServer(CONFIG, () => {
		done();
	});
}));

gulp.task('test/unit:sauce', gulp.series('build', function run(done) {
	const BROWSER_CONF = getBrowsersConfigFromCLI();
	const CONFIG = Object.assign({}, KARMA_CONFIG, {
		browsers: BROWSER_CONF.browsers,
		singleRun: true,
		browserNoActivityTimeout: 240000,
		captureTimeout: 120000,
		reporters: [
			'dots'
		]
	});
	if (!BROWSER_CONF.isSauce) {
		log(colors.red('There were no Saucelabs browsers provided, add them with the --browsers option.'));
		done();
	} else {
		startSauceConnect().then((scp) => createKarmaServer(CONFIG, (err) => {
			scp.close();
			done();
			process.exit(err ? 1 : 0);
		}), () => {
			done();
			process.exit(1);
		});
	}
}));

function createKarmaServer(config = {}, callback = () => {}) {
	let server = new karma.Server(config, callback);
	server.start();
}

function getBrowsersConfigFromCLI() {
	let isSauce = false;
	let rawInput = env.browsers ? env.browsers : 'CHROME_TRAVIS_CI';
	let inputList = rawInput.replace(' ', '').split(',');
	let outputList = [];
	for (let i = 0; i < inputList.length; i++) {
		let input = inputList[i];
		if (CUSTOM_LAUNCHERS.hasOwnProperty(input)) {
			// Non-sauce browsers case: overrides everything, ignoring other options
			outputList = [input];
			isSauce = false;
			break;
		} else if (CUSTOM_LAUNCHERS.hasOwnProperty(`SL_${input.toUpperCase()}`)) {
			isSauce = true;
			outputList.push(`SL_${input.toUpperCase()}`);
		} else if (SAUCE_ALIASES.hasOwnProperty(input.toUpperCase())) {
			outputList = outputList.concat(SAUCE_ALIASES[input]);
			isSauce = true;
		} else throw new Error('Browser name(s) passed as option could not be found in CUSTOM_LAUNCHERS. Check available browsers in "browsers.config.js".');
	}
	return {
		browsers: outputList.filter((item, pos, self) => {
			return self.indexOf(item) == pos;
		}),
		isSauce: isSauce
	}
}


/**
 * E2E Tests
 */

gulp.task('webdriver/update', function () {
	const binary = process.platform === 'win32'
		? 'node_modules\\.bin\\webdriver-manager'
		: 'node_modules/.bin/webdriver-manager';
	let proc = spawn(binary, ['update']);
	streamProcLog(proc);
	return proc;
});

// Run tests locally on Chrome.
gulp.task('test/e2e:local', gulp.series(
	'build',
	'webdriver/update',
	'server',
	function test(done) {
		const binary = process.platform === 'win32' ? 'node_modules\\.bin\\protractor' : 'node_modules/.bin/protractor';
		const proc = spawn(binary, ['protractor.config.js']);
		streamProcLog(proc);
		return proc.on('close', () => {
			done();
			process.exit();
		});
	}
));

// Run tests on SauceLabs browsers.
// Expects that SAUCE_USERNAME and SAUCE_ACCESS_KEY are set as env variables,
// or passed as args.
gulp.task('test/e2e:sauce', gulp.series(
	'build',
	'webdriver/update',
	'server',
	function test(done) {
		const binary = process.platform === 'win32' ? 'node_modules\\.bin\\protractor' : 'node_modules/.bin/protractor';
		startSauceConnect().then((scp) => {
			let proc = spawn(binary, ['protractor.config.js', '--sc']);
			streamProcLog(proc);
			proc.on('close', () => {
				done();
				scp.close();
				process.exit();
			});
		});
	}
));


/**
 * Firebase Deployments
 */

gulp.task(function deploy() {
	return runFirebaseCommand('deploy');
});

// Run Firebase commands such as: `deploy:rules`, etc.
// https://github.com/firebase/firebase-tools#commands
function runFirebaseCommand(cmd, args = []) {
	let binary = process.platform === 'win32' ? 'node_modules\\.bin\\firebase' : 'node_modules/.bin/firebase';
	const TOKEN = process.env.FIREBASE_TOKEN || env.token;

	if (!TOKEN) {
		log(colors.red('No FIREBASE_TOKEN found in env or --token option passed.'));
		return Promise.reject();
	}

	const defaultArgs = [
		'--non-interactive',
		'--token',
		`"${TOKEN}"`
	];

	if (Array.isArray(args)) {
		args.unshift.apply(args, defaultArgs);
	} else {
		args = defaultArgs;
	}

	binary += ` ${cmd}`;
	args.unshift(binary);

	const proc = exec(args.join(' '));

	streamProcLog(proc);

	return proc;
}


/**
 * Build, Watch & Serve
 */

gulp.task('serve', gulp.series(
	'build',
	'server',
	function start() {
		const watchers = [
			gulp.watch(PATHS.tests.ts, gulp.task('build/js:tests')),
			gulp.watch(PATHS.src.ts, gulp.task('build/js:app')),
			gulp.watch(PATHS.src.static, gulp.task('serve/static')),
			gulp.watch(PATHS.src.html, gulp.task('serve/html')),
			gulp.watch(PATHS.src.scss, gulp.task('build/css'))
		];
		log(colors.green('File watch processes for TS, HTML, SCSS & static assets are started'));
		open(`http://localhost:${BS_CONFIG.port}`);
		// When process exits stop all watchers
		process.on('exit', () => {
			// done();
			for (const watcher of watchers) {
				watcher.close();
			}
		});
	}
));


/**
 * Default
 */

gulp.task('default', gulp.task('serve'));


/**
 * Clean
 */

gulp.task(function clean() {
	return del([PATHS.dist.root]);
});


// Catch SIGINT and call process.exit() explicitly on 'CTRL + C' so that we actually get the exit event
process.on('SIGINT', function () {
	process.exit();
});


/**
 * Helpers
 */

function startSauceConnect() {
	log(colors.white('Starting sauce connect ...'));
	const SAUCE_USERNAME = process.env.SAUCE_USERNAME || env.username;
	const SAUCE_ACCESS_KEY = process.env.SAUCE_ACCESS_KEY || env.accessKey;
	if (!SAUCE_USERNAME) {
		log(colors.red('No SAUCE_USERNAME found in env or --username option passed.'));
		return Promise.reject();
	} else if (!SAUCE_ACCESS_KEY) {
		log(colors.red('No SAUCE_ACCESS_KEY found in env or --accessKey option passed.'));
		return Promise.reject();
	} else {
		return new Promise((resolve, reject) => {
			sauceConnectLauncher({username: SAUCE_USERNAME, accessKey: SAUCE_ACCESS_KEY}, (error, scp) => {
				if (error) {
					log(colors.red(error.message));
					reject(error);
				} else {
					log(colors.cyan("Sauce connect is ready"));
					resolve(scp);
				}
			});
		});
	}
}

function streamProcLog(proc) {
	proc.stdout.pipe(split()).on('data', (line) => {
		log(colors.white(line));
	});
	proc.stderr.pipe(split()).on('data', (line) => {
		log(colors.red(line));
	});
}
