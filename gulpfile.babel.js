import autoprefixer from 'gulp-autoprefixer';
import {create as createBrowserSyncServer} from 'browser-sync';
import changed from 'gulp-changed';
import del from 'del';
import {exec, spawn} from 'child_process';
import gulp from 'gulp';
import gts from 'gulp-typescript';
import {env, log, colors} from 'gulp-util';
import karma from 'karma';
import plumber from 'gulp-plumber';
import rename from 'gulp-rename';
import sauceConnectLauncher from 'sauce-connect-launcher';
import sass from 'gulp-sass';
import size from 'gulp-size';
import sourcemaps from 'gulp-sourcemaps';
import split from 'split2';
import tslint from 'gulp-tslint';
import typescript from 'typescript';
import {Server} from 'ws';
import WebSocket from 'ws';

import {CUSTOM_LAUNCHERS, SAUCE_ALIASES} from './browsers.config';


class WebSocketServer extends Server {
	static isRunning(address) {
		let ws = new WebSocket(address);
		return new Promise((resolve, reject) => {
			ws.addEventListener('error', (error) => {
				if (error.code === 'ECONNREFUSED') reject();
			});
			ws.addEventListener('open', () => {
				resolve();
			});
		});
	}
}

const bs = createBrowserSyncServer('NG2 Lab');

const GULP_SIZE_DEFAULT_OPTS = {
	showFiles: true,
	gzip: false
};

const KARMA_CONFIG = {
	configFile: `${__dirname}/karma.config.js`
};

const BASE_WS_SOCKET_ADDRESS = 'ws://localhost:';

const JS_BUILD_SERVER_PORT = 6174; // Kaprekar's constant
const JS_BUILD_SERVER_ADDRESS = `${BASE_WS_SOCKET_ADDRESS}${JS_BUILD_SERVER_PORT}`;

const BUILD_SERVER_PORT = 1729; // Hardy–Ramanujan number
const BUILD_SERVER_ADDRESS = `${BASE_WS_SOCKET_ADDRESS}${BUILD_SERVER_PORT}`;

const WEB_SERVER_PORT = 3000;

const PATHS = {
	lib: [
		'bower_components/firebase/firebase.js',
		'node_modules/es6-shim/es6-shim.*',
		'node_modules/systemjs/dist/system.*',
		'node_modules/angular2/bundles/angular2-polyfills.js',
		'node_modules/angular2/bundles/angular2-polyfills.min.js',
		'node_modules/angular2/bundles/angular2.js',
		'node_modules/angular2/bundles/angular2.min.js',
		'node_modules/angular2/bundles/angular2.dev.js',
		'node_modules/angular2/bundles/router.*',
		'node_modules/angular2/bundles/http.*',
		'node_modules/angular2/bundles/testing.*'
	],
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
 * Clean
 */

gulp.task(function clean() {
	return del([PATHS.dist.root]);
});


/**
 * Dependencies
 */

gulp.task('deps/rxjs', function () {
	const RXJS_LIB_PATH = `${PATHS.dist.public}/lib/rxjs`;
	return gulp
		.src('node_modules/rxjs/**/*')
		.pipe(changed(RXJS_LIB_PATH))
		.pipe(size(GULP_SIZE_DEFAULT_OPTS))
		.pipe(gulp.dest(RXJS_LIB_PATH));
});

gulp.task('deps', gulp.series('deps/rxjs', function copy() {
	const LIBS_PATH = `${PATHS.dist.public}/lib`;
	return gulp
		.src(PATHS.lib)
		.pipe(changed(LIBS_PATH))
		.pipe(rename((file) => {
			file.basename = file.basename.toLowerCase(); // Firebase is case sensitive, thus we lowercase all for ease of access
		}))
		.pipe(size(GULP_SIZE_DEFAULT_OPTS))
		.pipe(gulp.dest(LIBS_PATH));
}));


/**
 * Build Steps
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

gulp.task('serve/html', function () {
	return gulp
		.src(PATHS.src.html)
		.pipe(changed(PATHS.dist.public))
		.pipe(size(GULP_SIZE_DEFAULT_OPTS))
		.pipe(gulp.dest(PATHS.dist.public))
		.pipe(bs.stream());
});

gulp.task('build/css', function () {
	let SASS_CONFIG = {
		includePaths: [
			`${PATHS.src.root}/app`
		],
		outputStyle: 'compressed', // nested (default), expanded, compact, compressed
		indentType: 'tab',
		indentWidth: 1,
		linefeed: 'lf'
	};
	return gulp
		.src(PATHS.src.scss)
		.pipe(changed(PATHS.dist.public, {extension: '.css'}))
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass(SASS_CONFIG).on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(sourcemaps.write('.'))
		.pipe(size(GULP_SIZE_DEFAULT_OPTS))
		.pipe(gulp.dest(PATHS.dist.public))
		.pipe(bs.stream({match: "**/*.css"}));
});

gulp.task('serve/static', function () {
	return gulp
		.src(PATHS.src.static)
		.pipe(changed(PATHS.dist.public))
		.pipe(size(GULP_SIZE_DEFAULT_OPTS))
		.pipe(gulp.dest(PATHS.dist.public))
		.pipe(bs.stream());
});

gulp.task('build', gulp.series(
	'deps',
	gulp.parallel(
		'serve/static',
		'build/js',
		'serve/html',
		'build/css'
	)
));


/**
 * Code Integrity
 */

gulp.task(function lint(done) { // https://github.com/palantir/tslint#supported-rules
	return gulp
		.src([].concat(PATHS.tests.ts, PATHS.src.ts))
		.pipe(plumber())
		.pipe(tslint())
		.pipe(tslint.report('verbose', {
			summarizeFailureOutput: true,
			emitError: true
		}))
		.on('error', (error) => done(error));
});


/**
 * Unit Tests
 */

function createKarmaServer(config = {}, callback = noop) {
	let server = new karma.Server(config, callback);
	server.start();
}

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
	createJsBuildServer();
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
		log(colors.white('Starting sauce connect ...'));
		const SAUCE_USERNAME = process.env.SAUCE_USERNAME || env.username;
		const SAUCE_ACCESS_KEY = process.env.SAUCE_ACCESS_KEY || env.accessKey;
		if (!SAUCE_USERNAME) {
			log(colors.red('No SAUCE_USERNAME found in env or --username option passed.'));
			done();
		} else if (!SAUCE_ACCESS_KEY) {
			log(colors.red('No SAUCE_ACCESS_KEY found in env or --accessKey option passed.'));
			done();
		} else {
			sauceConnectLauncher({username: SAUCE_USERNAME, accessKey: SAUCE_ACCESS_KEY}, (err, proc) => {
				if (err) {
					log(colors.red(err.message));
					done();
					process.exit(1);
				} else {
					log(colors.cyan("Sauce connect is ready"));
					createKarmaServer(CONFIG, (err) => {
						proc.close();
						done();
						process.exit(err ? 1 : 0);
					});
				}
			});
		}
	}
}));


/**
 * E2E Tests
 */

function createHttpServer() {
	const binary = process.platform === 'win32'
		? 'node_modules\\.bin\\http-server'
		: 'node_modules/.bin/http-server';
	return new Promise((resolve) => {
		WebSocketServer.isRunning(BUILD_SERVER_ADDRESS).then(
			() => {
				log(colors.yellow(`A web server is already running on port ${WEB_SERVER_PORT}`));
				resolve();
			},
			() => {
				log(colors.green(`Webserver started on port ${WEB_SERVER_PORT}`));
				let proc = spawn(binary, [
					PATHS.dist.public,
					`-p ${WEB_SERVER_PORT}`,
					'--silent'
				]);
				// Let's wait for our webserver to be online
				setTimeout(() => resolve(proc));
				streamProcLog(proc);
			}
		);
	});
}

gulp.task('webdriver/update', function () {
	const binary = process.platform === 'win32' ? 'node_modules\\.bin\\webdriver-manager' : 'node_modules/.bin/webdriver-manager';
	let proc = spawn(binary, ['update']);
	streamProcLog(proc);
	return proc;
});

// Locally we need to run a build before we run any tests
gulp.task('test/e2e:single', gulp.series(
	'build',
	'webdriver/update',
	function protractor(done) { // Run e2e tests once in local env
		const binary = process.platform === 'win32' ? 'node_modules\\.bin\\protractor' : 'node_modules/.bin/protractor';
		createHttpServer().then(({pid} = {}) => {
			let proc = spawn(binary, ['protractor.config.js']);
			streamProcLog(proc);
			proc.on('close', () => {
				if (pid) process.kill(pid);
				done();
			});
		});
	}
));


/**
 * Firebase Deployments
 */

// https://github.com/firebase/firebase-tools#commands
function runFirebaseCommand(cmd, args = []) {
	let binary = process.platform === 'win32' ? 'node_modules\\.bin\\firebase' : 'node_modules/.bin/firebase';
	const TOKEN = process.env.FIREBASE_TOKEN || env.token;
	if (!TOKEN) {
		log(colors.red('No FIREBASE_TOKEN found in env or --token option passed.'));
		return Promise.reject();
	}
	let defaultArgs = [
		'--non-interactive',
		'--token',
		`"${TOKEN}"`
	];
	if (Array.isArray(args)) args.unshift.apply(args, defaultArgs);
	else args = defaultArgs;
	binary += ` ${cmd}`;
	args.unshift(binary);
	let proc = exec(args.join(' '));
	streamProcLog(proc);
	return proc;
}

gulp.task('deploy/hosting', function () {
	return runFirebaseCommand('deploy:hosting');
});

gulp.task('deploy/rules', function () {
	return runFirebaseCommand('deploy:rules');
});

gulp.task(function deploy() {
	return runFirebaseCommand('deploy');
});


/**
 * Build, Watch & Serve
 */

function createBuildServer() {
	let wss = new WebSocketServer({port: BUILD_SERVER_PORT}, () => {
		log(colors.green(`Build server started ${BUILD_SERVER_ADDRESS}`));
	});
	process.on('exit', () => {
		wss.close();
	});
}

gulp.task(function serve(done) {
	WebSocketServer.isRunning(BUILD_SERVER_ADDRESS).then(
		() => {
			log(colors.red('A build server instance has already been started in another process, cannot start another one'));
			done();
			process.exit(1);
		},
		() => {
			gulp.task('build')(() => {
				createJsBuildServer();
				createBuildServer();
				log(colors.green('File watch processes for HTML, CSS & static assets are started'));
				gulp.watch(PATHS.src.static, gulp.series('serve/static'));
				gulp.watch(PATHS.src.html, gulp.series('serve/html'));
				gulp.watch(PATHS.src.scss, gulp.series('build/css'));
				// For more BS options,
				// check http://www.browsersync.io/docs/options/
				bs.init({
					server: PATHS.dist.public,
					port: WEB_SERVER_PORT
				}, done);
				// When process exits kill browser-sync server
				process.on('exit', () => {
					bs.exit();
				});
			});
		}
	);
});


/**
 * Default
 */

gulp.task('default', gulp.task('serve'));


// Catch SIGINT and call process.exit() explicitly on CTRL+C so that we actually get the exit event
process.on('SIGINT', function () {
	process.exit();
});


/**
 * Helpers
 */

function buildJs(src, dest, base = './', options = {}) {
	const TS_PROJECT = gts.createProject('tsconfig.json', Object.assign(options, {
		typescript: typescript
	}));
	return gulp
		.src(src, {base: base}) // instead of gulp.src(...), project.src() can be used
		.pipe(changed(dest, {extension: '.js'}))
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(gts(TS_PROJECT))
		.js
		.pipe(sourcemaps.write('.'))
		.pipe(size(GULP_SIZE_DEFAULT_OPTS))
		.pipe(gulp.dest(dest));
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

// Create a build server to avoid parallel js builds when running unit tests in another process
// If the js build server is shut down from some other process (the same process that started it), restart it here
function createJsBuildServer() {
	WebSocketServer.isRunning(JS_BUILD_SERVER_ADDRESS).then(
		() => {
			log(colors.yellow(`JS build server already running on ${JS_BUILD_SERVER_ADDRESS}`));
			let ws = new WebSocket(JS_BUILD_SERVER_ADDRESS);
			ws.addEventListener('close', () => {
				createJsBuildServer();
			});
		},
		() => {
			let watchers = [
				gulp.watch(PATHS.src.ts, gulp.series('build/js:app')),
				gulp.watch(PATHS.tests.ts, gulp.series('build/js:tests'))
			];
			let wss = new WebSocketServer({port: JS_BUILD_SERVER_PORT}, () => {
				log(colors.green(`JS build server started ${JS_BUILD_SERVER_ADDRESS}`));
			});
			process.on('exit', () => {
				for (let watcher of watchers) {
					watcher.close();
				}
				wss.close();
			});
		}
	);
}

function streamProcLog(proc) {
	proc.stdout.pipe(split()).on('data', (line) => {
		log(colors.white(line));
	});
	proc.stderr.pipe(split()).on('data', (line) => {
		log(colors.red(line));
	});
}

function noop(...args) {}