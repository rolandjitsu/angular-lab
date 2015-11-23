import autoprefixer from 'gulp-autoprefixer';
import { commands as bower } from 'bower';
import changed from 'gulp-changed';
import connect from 'gulp-connect';
import del from 'del';
import { exec } from 'child_process';
import gulp from 'gulp';
import { log, colors } from 'gulp-util';
import karma from 'karma';
import minimist from 'minimist';
import plumber from 'gulp-plumber';
import rename from 'gulp-rename';
import sass from 'gulp-sass';
import size from 'gulp-size';
import sourcemaps from 'gulp-sourcemaps';
import tslint from 'gulp-tslint';
import tsd from 'tsd';
import ts from 'gulp-typescript';
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
	test: {
		root: 'test',
		ts: [
			'test/**/*.ts'
		]
	},
	src: {
		root: 'src',
		static: 'src/**/*.{svg,jpg,png,ico}',
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
		test: 'dist/test',
		app: 'dist/app'
	}
};


/**
 * Clean dist
 */

gulp.task(function clean () {
	return del([PATHS.dist.root]);
});


/**
 * Dependecies
 */

gulp.task('bower/install', function () {
	return bower.install(null, { save: true }, { interactive: false });
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

gulp.task('deps', gulp.series(
	gulp.parallel('bower/install', 'tsd/install'),
	function copy () {
		const LIBS_PATH = `${PATHS.dist.app}/lib`;
		return gulp
			.src(PATHS.lib)
			.pipe(changed(LIBS_PATH))
			.pipe(rename((file) => {
				file.basename = file.basename.toLowerCase(); // Firebase is case sensitive, thus we lowercase all for ease of access
			}))
			.pipe(size(GULP_SIZE_DEFAULT_OPTS))
			.pipe(gulp.dest(LIBS_PATH));
	}
));


/**
 * Build steps
 */

gulp.task('build/js:tests', function tests () {
	return buildJs(
		[].concat(PATHS.typings, PATHS.test.ts),
		PATHS.dist.test,
		PATHS.test.root
	);
});

gulp.task('build/js:app', function app () {
	return buildJs([].concat(PATHS.typings, PATHS.src.ts), PATHS.dist.app, PATHS.src.root)
		.pipe(connect.reload());
});

gulp.task('build/js', gulp.parallel(
	'build/js:tests',
	'build/js:app'
));

gulp.task('serve/html', function html () {
	return gulp
		.src(PATHS.src.html)
		.pipe(changed(PATHS.dist.app))
		.pipe(size(GULP_SIZE_DEFAULT_OPTS))
		.pipe(gulp.dest(PATHS.dist.app))
		.pipe(connect.reload());
});

gulp.task('build/css', function css () {
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
		.pipe(changed(PATHS.dist.app, { extension: '.css' }))
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass(SASS_CONFIG).on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(sourcemaps.write('.'))
		.pipe(size(GULP_SIZE_DEFAULT_OPTS))
		.pipe(gulp.dest(PATHS.dist.app))
		.pipe(connect.reload());
});

gulp.task('serve/static', function assets () {
	return gulp
		.src(PATHS.src.static)
		.pipe(changed(PATHS.dist.app))
		.pipe(size(GULP_SIZE_DEFAULT_OPTS))
		.pipe(gulp.dest(PATHS.dist.app))
		.pipe(connect.reload());
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

// Build if lab build server is not running
gulp.task('build:!ibsr', function build (done) {
	WebSocketServer.isRunning(BUILD_SERVER_ADDRESS).then(() => done(), () => {
		gulp.task('build')((error) => done(error));
	});
});


/**
 * Code integrity
 */

gulp.task('lint', function lint (done) { // https://github.com/palantir/tslint#supported-rules
	return gulp
		.src([].concat(PATHS.test.ts, PATHS.src.ts))
		.pipe(plumber())
		.pipe(tslint())
		.pipe(tslint.report('verbose', {
			summarizeFailureOutput: true,
			emitError: true
		}))
		.on('error', (error) => done(error));
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

gulp.task('test/unit:single', gulp.series('build:!ibsr', function run (done) { // Run unit tests once in local env
	const CONFIG = Object.assign({}, KARMA_CONFIG, {
		singleRun: true
	});
	createKarmaServer(CONFIG, () => {
		done();
	});
}));

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

gulp.task('test/unit:sauce', gulp.series('build:!ibsr', function run (done) {
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
		log(colors.red('There were no Saucelabs browsers provided, add them with the --browsers option'));
		done();
		process.exit(1);
	} else {
		createKarmaServer(CONFIG, (err) => {
			done();
			process.exit(err ? 1 : 0);
		});
	}
}));

gulp.task('test/unit', gulp.series('build:!ibsr', function run (done) {
	createKarmaServer(KARMA_CONFIG);
	createJsBuildServer();
}));

gulp.task('test', gulp.series(
	'lint',
	'test/unit:single'
));


/**
 * Deployments
 */

gulp.task('deploy/hosting', gulp.series('build:!ibsr', function deploy () {
	return runFirebaseCommand('deploy:hosting');
}));

gulp.task('deploy/hosting:ci', function (done) {
	runFirebaseCommand('deploy:hosting').then(
		() => done(),
		() => {
			done();
			process.exit(1);
		}
	);
});

gulp.task('deploy', gulp.series(
	'deploy/hosting'
));


/**
 * Build and watch
 */

gulp.task(function start (done) {
	WebSocketServer.isRunning(BUILD_SERVER_ADDRESS).then(
		() => {
			log(colors.red('A lab build server instance has already been started in another process, cannot start another one'));
			done();
			process.exit(1);
		},
		() => {
			gulp.task('build')(() => {
				createJsBuildServer();
				createBuildServer();
				connect.server({
					port: WEB_SERVER_PORT,
					root: PATHS.dist.app,
					livereload: true
				});
				log(colors.green('File watch processes for HTML, CSS & static assets are started'));
				gulp.watch(PATHS.src.static, gulp.series('serve/static'));
				gulp.watch(PATHS.src.html, gulp.series('serve/html'));
				gulp.watch(PATHS.src.scss, gulp.series('build/css'));
				// When process exits kill connect server
				process.on('exit', () => {
					connect.serverClose();
				});
			});
		}
	);
});


/**
 * Default task
 */

gulp.task('default', gulp.series('start'));


// Catch SIGINT and call process.exit() explicitly on CTRL+C so that we actually get the exit event
process.on('SIGINT', function () {
	process.exit();
});


function createKarmaServer (config = {}, callback = noop) {
	let server = new karma.Server(config, callback);
	server.start();
}

// Returns a stream
function buildJs (src, dest, base = './') {
	const TS_PROJECT = ts.createProject('tsconfig.json');
	return gulp
		.src(src, { base: base }) // instead of gulp.src(...), project.src() can be used
		.pipe(changed(dest, { extension: '.js' }))
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(ts(TS_PROJECT))
		.js
		.pipe(sourcemaps.write('.'))
		.pipe(size(GULP_SIZE_DEFAULT_OPTS))
		.pipe(gulp.dest(dest));
}

// https://github.com/firebase/firebase-tools#commands
function runFirebaseCommand (cmd) {
	const binary = process.platform === 'win32' ? 'node_modules\\.bin\\firebase' : 'node node_modules/.bin/firebase';
	const argv = minimist(process.argv.slice(2));
	const TOKEN = process.env.FIREBASE_TOKEN || argv.token;
	if (!TOKEN) {
		log(colors.red('No FIREBASE_TOKEN found in env or --token option passed.'));
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

function createBuildServer () {
	let wss = new WebSocketServer({ port: BUILD_SERVER_PORT }, () => {
		log(colors.green(`Lab build server started ${BUILD_SERVER_ADDRESS}`));
	});
	process.on('exit', () => {
		wss.close();
	});
}

// Create a build server to avoid parallel js builds when running unit tests in another process
// If the js build server is shut down from some other process (the same process that started it), restart it here
function createJsBuildServer () {
	WebSocketServer.isRunning(JS_BUILD_SERVER_ADDRESS).then(
		() => {
			log(colors.yellow(`JS build server already running on ${JS_BUILD_SERVER_ADDRESS}`));
			let ws = new WebSocket(JS_BUILD_SERVER_ADDRESS);
			ws.addEventListener('close', () => {
				createJsBuildServer();
			});
		},
		() => {
			let watcher = gulp.watch([].concat(PATHS.test.ts, PATHS.src.ts), gulp.series('build/js'));
			let wss = new WebSocketServer({ port: JS_BUILD_SERVER_PORT }, () => {
				log(colors.green(`JS build server started ${JS_BUILD_SERVER_ADDRESS}`));
			});
			process.on('exit', () => {
				watcher.close();
				wss.close();
			});
		}
	);
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