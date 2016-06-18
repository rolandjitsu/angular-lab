// Add unsupported ES6/7 methods
import 'babel-polyfill';


import autoprefixer from 'gulp-autoprefixer';
import changed from 'gulp-changed';
import {create as createBrowserSyncServer} from 'browser-sync';
import {colors, env, log} from 'gulp-util';
import {exec, spawn} from 'child_process';
import del from 'del';
import gulp from 'gulp';
import jspmConfig from 'jspm/lib/config';
import karma from 'karma';
import open from 'open';
import plumber from 'gulp-plumber';
import sauceConnectLauncher from 'sauce-connect-launcher';
import size from 'gulp-size';
import sourcemaps from 'gulp-sourcemaps';
import split from 'split2';
import through from 'through2';
import tslint from 'gulp-tslint';
import typescript from 'gulp-typescript';

const bs = createBrowserSyncServer('NG2 Lab');

import {
	SAUCE_ALIASES,
	providers
} from './browsers.config';
const KARMA_CONFIG = {configFile: `${__dirname}/karma.config.js`};
const BS_CONFIG = require('./bs.config');
const GULP_SIZE_DEFAULT_CONFIG = {
	showFiles: true,
	gzip: false
};

const PATHS = {
	typings: [
		'node_modules/typescript/lib/lib.es2016.d.ts',
		'typings/index.d.ts'
	],
	src: {
		static: [
			'assets/**/*.{svg,jpg,png,ico,txt}',
			'apple-touch-icon.png',
			'favicon.ico',
			'humans.txt',
			'LICENSE',
			'robots.txt'
		],
		ts: [
			'app/**/*.ts'
		],
		html: [
			'app/**/*.html',
			'index.html'
		],
		scss: [
			'app/**/*.scss'
		]
	},
	dist: 'dist'
};


/**
 * Start a web server using BS
 * See https://www.browsersync.io/docs
 */

gulp.task(function server(done) {
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
	return gulp
		.src([
			'jspm_packages/**/.*',
			'jspm_packages/**/*'
		], {
			base: '.'
		})
		.pipe(changed(PATHS.dist))
		.pipe(size(GULP_SIZE_DEFAULT_CONFIG))
		.pipe(gulp.dest(PATHS.dist));
});

gulp.task('deps/jspm:browser', function () {
	return gulp
		.src('jspm.browser.js')
		.pipe(changed(PATHS.dist))
		.pipe(size(GULP_SIZE_DEFAULT_CONFIG))
		.pipe(gulp.dest(PATHS.dist));
});

gulp.task('deps/jspm:config', function () {
	jspmConfig.loadSync();
	return gulp
		.src('jspm.config.js')
		.pipe(changed(PATHS.dist))
		.pipe(transform(jspmConfig.loader.getConfig()))
		.pipe(size(GULP_SIZE_DEFAULT_CONFIG))
		.pipe(gulp.dest(PATHS.dist));
});

function transform(config) {
	config.production = true;
	config.transpiler = 'none';
	delete config.typescriptOptions;
	delete config.packages.test;
	config.packages.app = {
		defaultExtension: 'ts',
			map: {
			'./env': {
				'~production': './env.dev'
			}
		}
	};

	return through.obj((chunk, enc, callback) => {
		chunk.contents = new Buffer(`SystemJS.config(${JSON.stringify(config)})`, 'utf8');
		callback(null, chunk);
	});
}


gulp.task('deps', gulp.parallel(
	'deps/jspm:packages',
	'deps/jspm:browser',
	'deps/jspm:config'
));


/**
 * Copy static assets
 */

gulp.task('serve/static', function () {
	return gulp
		.src(PATHS.src.static, {
			base: '.'
		})
		.pipe(changed(PATHS.dist))
		.pipe(size(GULP_SIZE_DEFAULT_CONFIG))
		.pipe(gulp.dest(PATHS.dist));
});


/**
 * Copy HTML
 */

gulp.task('serve/html', function () {
	return gulp
		.src(PATHS.src.html, {
			base: '.'
		})
		.pipe(changed(PATHS.dist))
		.pipe(size(GULP_SIZE_DEFAULT_CONFIG))
		.pipe(gulp.dest(PATHS.dist));
});


/**
 * Build JS
 */

gulp.task('build/js', function () {
	return gulp
		// TODO: do not build spec files
		.src([].concat(PATHS.typings, PATHS.src.ts), {
			base: '.'
		})
		.pipe(changed(PATHS.dist, {
			extension: '.js'
		}))
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(typescript(typescript.createProject('tsconfig.json', {
			typescript: require('typescript')
		})))
		.js
		.pipe(sourcemaps.write('.'))
		.pipe(size(GULP_SIZE_DEFAULT_CONFIG))
		.pipe(gulp.dest(PATHS.dist));
});


/**
 * Build CSS
 */

gulp.task('build/css', function () {
	return gulp
		.src(PATHS.src.scss, {
			base: '.'
		})
		.pipe(changed(PATHS.dist, {
			extension: '.css'
		}))
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(autoprefixer())
		.pipe(sourcemaps.write('.'))
		.pipe(size(GULP_SIZE_DEFAULT_CONFIG))
		.pipe(gulp.dest(PATHS.dist));
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
		.src(PATHS.src.ts)
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

gulp.task('test/unit:ci', function (done) {
	const {browsers} = providers();
	const CONFIG = Object.assign({}, KARMA_CONFIG, {
		browsers,
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

// Run unit tests in watch mode
gulp.task('test/unit:continuous', function (done) {
	createKarmaServer(KARMA_CONFIG, () => done());
});

// Run unit tests once
gulp.task('test/unit:single', function (done) {
	createKarmaServer(Object.assign({}, KARMA_CONFIG, {
		singleRun: true
	}), () => done());
});

// Run unit tests once
// (runs tests on SauceLabs if `--browsers` option is provided).
gulp.task('test/unit:single/sauce', function (done) {
	const {browsers, isSauce} = providers();
	const CONFIG = Object.assign({}, KARMA_CONFIG, {
		browsers,
		singleRun: true,
		browserNoActivityTimeout: 240000,
		captureTimeout: 120000,
		reporters: [
			'dots'
		]
	});
	if (!isSauce) {
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
});

function createKarmaServer(config = {}, callback = () => {}) {
	let server = new karma.Server(config, callback);
	server.start();
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

// TODO: migrate to new API 3.0
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
 * Start server and open app in browser
 */

// TODO: we need to figure out a way to reload the browser or code when there are changes, look into systemjs hot reloader
gulp.task('serve', gulp.series(
	'server',
	function start() {
		open(`http://localhost:${BS_CONFIG.port}`);
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
	return del([PATHS.dist]);
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
