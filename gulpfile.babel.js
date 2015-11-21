import autoprefixer from 'gulp-autoprefixer';
import bower from 'bower';
import changed from 'gulp-changed';
import connect from 'gulp-connect';
import del from 'del';
import { exec } from 'child_process';
import gulp from 'gulp';
import gutil from 'gulp-util';
import karma from 'karma';
import minimist from 'minimist';
import plumber from 'gulp-plumber';
import rename from 'gulp-rename';
import runSequence from 'run-sequence';
import sass from 'gulp-sass';
import size from 'gulp-size';
import sourcemaps from 'gulp-sourcemaps';
import tslint from 'gulp-tslint';
import tsd from 'tsd';
import ts from 'gulp-typescript';
import watch from 'gulp-watch';
import { Server } from 'ws';
import WebSocket from 'ws';

import { SAUCE_LAUNCHERS, SAUCE_ALIASES } from './sauce.config';


const GULP_SIZE_DEFAULT_OPTS = {
	showFiles: true,
	gzip: true
};

const KARMA_CONFIG = {
	configFile: `${__dirname}/karma.config.js`
};

const ENGINE_IO_BASE_SOCKET_ADDRESS = 'ws://localhost:';

const JS_BUILD_SERVER_PORT = 6174; // Kaprekar's constant
const JS_BUILD_SERVER_ADDRESS = `${ENGINE_IO_BASE_SOCKET_ADDRESS}${JS_BUILD_SERVER_PORT}`;

const BUILD_SERVER_PORT = 1729; // Hardy–Ramanujan number
const BUILD_SERVER_ADDRESS = `${ENGINE_IO_BASE_SOCKET_ADDRESS}${BUILD_SERVER_PORT}`;

const WEB_SERVER_PORT = 3000;

const PATHS = {
	lib: [
		'bower_components/firebase/firebase.js',
		'node_modules/es6-shim/es6-shim.*',
		'node_modules/systemjs/dist/system.*',
		'node_modules/angular2/bundles/angular2.*',
		'node_modules/angular2/bundles/router.*',
		'node_modules/angular2/bundles/http.*',
		'node_modules/angular2/bundles/testing.*'
	],
	typings: [
		'src/_typings/custom.d.ts',
		'tsd_typings/tsd.d.ts'
	],
	src: {
		root: './src',
		static: 'src/**/*.{svg,jpg,png,ico}',
		ts: [
			'!src/_typings/*.d.ts',
			'src/**/*.ts'
		],
		html: 'src/**/*.html',
		scss: [
			'!src/app/vars.scss',
			'!src/app/mixins.scss',
			'src/**/*.scss'
		],
		spec: [
			'src/**/*.spec.ts'
		]
	},
	dist: 'dist'
};

const NG2_LAB_TS_PROJECT = ts.createProject('tsconfig.json');


/**
 * Clean dist
 */

gulp.task('clean', (done) => {
	del([PATHS.dist]).then(() => {
		done();
	});
});


/**
 * Dependecies
 */

gulp.task('bower/install', function (done) {
	bower
		.commands
		.install(null, { save: true }, { interactive: false })
		.on('error', console.error.bind(console))
		.on('end', () => {
			done();
		});
});

gulp.task('tsd/install', function () {
	const TSD_CONFIG = './tsd.json';
	let api = tsd.getAPI(TSD_CONFIG);
	return api.readConfig(TSD_CONFIG, true).then(() => {
		let opts = tsd.Options.fromJSON(); // https://github.com/DefinitelyTyped/tsd/blob/bb2dc91ad64f159298657805154259f9e68ea8a6/src/tsd/Options.ts
		let query = new tsd.Query();
		opts.saveBundle = true;
		opts.overwriteFiles = true;
		opts.resolveDependencies = true;
		api.context.config.getInstalled().forEach((install) => {
			let def = tsd.Def.getFrom(install.path);
			query.addNamePattern(`${def.project}/${def.name}`);
		});
		query.versionMatcher = new tsd.VersionMatcher('latest');
		return api.select(query, opts).then((selection) => {
			return api.install(selection, opts);
		});
	});
});

gulp.task('deps', ['bower/install', 'tsd/install'], function () {
	const LIBS_PATH = `${PATHS.dist}/lib`;
	return gulp
		.src(PATHS.lib)
		.pipe(changed(LIBS_PATH))
		.pipe(rename((file) => {
			file.basename = file.basename.toLowerCase(); // Firebase is case sensitive, thus we lowercase all for ease of access
		}))
		.pipe(size(GULP_SIZE_DEFAULT_OPTS))
		.pipe(gulp.dest(LIBS_PATH));
});


/**
 * Build steps
 */

let jsBuildServerWebSocket;
gulp.task('build/js', function (done) {
	if (jsBuildServerWebSocket) {
		let stream = buildJS();
		stream.on('end', () => {
			done();
		});
	}
	else {
		WebSocketServer.isRunning(JS_BUILD_SERVER_ADDRESS).then(
			() => {
				jsBuildServerWebSocket = new WebSocket(JS_BUILD_SERVER_ADDRESS);
				jsBuildServerWebSocket.addEventListener('open', () => {
					let stream = buildJS();
					stream.on('end', () => {
						done();
					});
				})
			},
			() => {
				let stream = buildJS();
				stream.on('end', () => {
					done();
				});
			}
		);
	}
});

gulp.task('serve/html', function () {
	return gulp
		.src(PATHS.src.html)
		.pipe(changed(PATHS.dist))
		.pipe(size(GULP_SIZE_DEFAULT_OPTS))
		.pipe(gulp.dest(PATHS.dist));
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
		.pipe(changed(PATHS.dist, { extension: '.css' }))
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass(SASS_CONFIG).on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(sourcemaps.write('.'))
		.pipe(size(GULP_SIZE_DEFAULT_OPTS))
		.pipe(gulp.dest(PATHS.dist));
});

gulp.task('serve/static', function () {
	return gulp
		.src(PATHS.src.static)
		.pipe(changed(PATHS.dist))
		.pipe(size(GULP_SIZE_DEFAULT_OPTS))
		.pipe(gulp.dest(PATHS.dist));
});

gulp.task('build', function (done) {
	runSequence(
		'deps',
		[
			'serve/static',
			'build/js',
			'serve/html',
			'build/css'
		],
		done
	);
});

// Build if lab build server is not running
gulp.task('build:!ilbsr', function (done) {
	WebSocketServer.isRunning(BUILD_SERVER_ADDRESS).then(
		() => done(),
		() => {
			runSequence('build', done);
		}
	);
});


/**
 * Code integrity
 */

gulp.task('lint', function () { // https://github.com/palantir/tslint#supported-rules
	return gulp
		.src(PATHS.src.ts)
		.pipe(plumber())
		.pipe(tslint())
		.pipe(tslint.report('verbose', {
			summarizeFailureOutput: true,
			emitError: true
		}));
});


/**
 * Unit tests
 */

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

gulp.task('test/unit:single', ['build:!ilbsr'], function (done) { // Run unit tests once in local env
	const CONFIG = Object.assign({}, KARMA_CONFIG, {
		singleRun: true
	});
	createKarmaServer(CONFIG, () => {
		done();
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

gulp.task('test/unit:sauce', ['build:!ilbsr'], function (done) {
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
		gutil.log(gutil.colors.red('There were no Saucelabs browsers provided, add them with the --browsers option'));
		done();
		process.exit(1);
	} else {
		createKarmaServer(CONFIG, (err) => {
			done();
			process.exit(err ? 1 : 0);
		});
	}
});

gulp.task('test/unit', ['build:!ilbsr'], function (done) {
	createKarmaServer(KARMA_CONFIG);
	new JsBuildServer();
});

gulp.task('test', function (done) {
	runSequence(
		'lint',
		'test/unit:single',
		done
	);
});


/**
 * Deployments
 */

gulp.task('deploy/hosting', ['build:!ilbsr'], function () {
	return runFirebaseCommand('deploy:hosting');
});

gulp.task('deploy/hosting:ci', function (done) {
	runFirebaseCommand('deploy:hosting').then(
		() => done(),
		() => {
			done();
			process.exit(1);
		}
	);
});

gulp.task('deploy', function (done) {
	runSequence('deploy/hosting', done);
});


/**
 * Build and watch
 */

gulp.task('start', function (done) {
	WebSocketServer.isRunning(BUILD_SERVER_ADDRESS).then(
		() => {
			gutil.log(gutil.colors.red('A lab build server instance has already been started in another process, cannot start another one'));
			done();
			process.exit(1);
		},
		() => {
			runSequence('build', () => {
				new JsBuildServer();
				new BuildServer();
				connect.server({
					port: WEB_SERVER_PORT,
					root: PATHS.dist
				});
				gutil.log(gutil.colors.green('File watch processes for HTML, CSS & static assets are started'));
				watch(PATHS.src.static, () => {
					runSequence('serve/static');
				});
				watch(PATHS.src.html, () => {
					runSequence('serve/html');
				});
				watch(PATHS.src.scss, () => {
					runSequence('build/css');
				});
			});
		}
	);
});


/**
 * Default task
 */

gulp.task('default', [
	'start'
]);


// Catch SIGINT and call process.exit() explicitly on CTRL+C so that we actually get the exit event
process.on('SIGINT', function () {
	process.exit();
});


function createKarmaServer (config = {}, callback = noop) {
	let server = new karma.Server(config, callback);
	server.start();
}

function buildJS () {
	return gulp
		.src(PATHS.src.ts.slice(-1).concat(PATHS.typings), { base: PATHS.src.root }) // instead of gulp.src(...), project.src() can be used
		.pipe(changed(PATHS.dist, { extension: '.js' }))
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(ts(NG2_LAB_TS_PROJECT))
		.js
		.pipe(sourcemaps.write('.'))
		.pipe(size(GULP_SIZE_DEFAULT_OPTS))
		.pipe(gulp.dest(PATHS.dist));
}

// https://github.com/firebase/firebase-tools#commands
function runFirebaseCommand (cmd) {
	const binary = process.platform === 'win32' ? 'node_modules\\.bin\\firebase' : 'node node_modules/.bin/firebase';
	const argv = minimist(process.argv.slice(2));
	const TOKEN = process.env.FIREBASE_TOKEN || argv.token;
	if (!TOKEN) {
		gutil.log(gutil.colors.red('No FIREBASE_TOKEN found in env or --token option passed.'));
		return Promise.reject();
	}
	let args = [
		'--non-interactive',
		'--token',
		`"${TOKEN}"`
	];
	if (Array.isArray(cmd)) args.unshift.apply(args, cmd);
	else args.unshift(cmd);
	args.unshift(binary);
	return new Promise((resolve, reject) => {
		let proc = exec(args.join(' '), (error, stdout, stderr) => {
			if (error !== null) reject();
			resolve();
		});
		proc.stdout.on('data', (data) => {
			console.log(data);
		});
		proc.stderr.on('data', (data) => {
			console.log(data);
		});
	});
}

function getBrowsersConfigFromCLI () {
	let isSauce = false;
	const args = minimist(process.argv.slice(2));
	let rawInput = args.browsers ? args.browsers : 'CHROME_TRAVIS_CI';
	let inputList = rawInput.replace(' ', '').split(',');
	let outputList = [];
	for (let i = 0; i < inputList.length; i++) {
		let input = inputList[i];
		if (SAUCE_LAUNCHERS.hasOwnProperty(input)) {
			// Non-sauce browsers case: overrides everything, ignoring other options
			outputList = [input];
			isSauce = false;
			break;
		} else if (SAUCE_LAUNCHERS.hasOwnProperty(`SL_${input.toUpperCase()}`)) {
			isSauce = true;
			outputList.push(`SL_${input.toUpperCase()}`);
		} else if (SAUCE_ALIASES.hasOwnProperty(input.toUpperCase())) {
			outputList = outputList.concat(SAUCE_ALIASES[input]);
			isSauce = true;
		} else throw new Error('ERROR: unknown browser found in getBrowsersConfigFromCLI()');
	}
	return {
		browsers: outputList.filter((item, pos, self) => {
			return self.indexOf(item) == pos;
		}),
		isSauce: isSauce
	}
}

class BuildServer {
	constructor() {
		let wss = new WebSocketServer({ port: BUILD_SERVER_PORT }, () => {
			gutil.log(gutil.colors.green(`Lab build server started ${BUILD_SERVER_ADDRESS}`));
		});
		process.on('exit', () => {
			wss.close();
		});
	}
}

// Create a build server to avoid parallel js builds when running unit tests in another process
// If the js build server is shut down from some other process (the same process that started it), restart it here
class JsBuildServer {
	constructor() {
		WebSocketServer.isRunning(JS_BUILD_SERVER_ADDRESS).then(
			() => {
				gutil.log(gutil.colors.yellow(`JS build server already running on ${JS_BUILD_SERVER_ADDRESS}`));
				let ws = new WebSocket(JS_BUILD_SERVER_ADDRESS);
				ws.addEventListener('close', () => {
					new JsBuildServer();
				});
			},
			() => {
				let watcher = watch(PATHS.src.ts, () => {
					runSequence('build/js');
				});
				let wss = new WebSocketServer({ port: JS_BUILD_SERVER_PORT }, () => {
					gutil.log(gutil.colors.green(`JS build server started ${JS_BUILD_SERVER_ADDRESS}`));
				});
				process.on('exit', () => {
					watcher.close();
					wss.close();
				});
			}
		);
	}
}

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

function noop (...args) {}