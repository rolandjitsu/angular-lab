const {create} = require('browser-sync');
const {spawn, exec} = require('child_process');
const del = require('del');
const firebase = require('firebase-tools');
const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const changed = require('gulp-changed');
const plumber = require('gulp-plumber');
const size = require('gulp-size');
const sourcemaps = require('gulp-sourcemaps');
const tslint = require('gulp-tslint');
const typescript = require('gulp-typescript');
const {colors, env, log} = require('gulp-util');
const jspm = require('jspm');
const jspmConfig = require('jspm/lib/config');
const karma = require('karma');
const sauceConnectLauncher = require('sauce-connect-launcher');
const split = require('split2');
const through = require('through2');

const bs = create('NG2 Lab');

const {
	SAUCE_ALIASES,
	providers
} = require('./browsers.config');
const KARMA_CONFIG = {configFile: `${__dirname}/karma.config.js`};
const BS_CONFIG = require('./bs.config');
const GULP_SIZE_DEFAULT_CONFIG = {
	showFiles: true,
	gzip: false
};

const PATHS = {
	typings: [
		// Ensures ES6/7 API definitions are available when transpiling TS to JS.
		'node_modules/typescript/lib/lib.es2017.d.ts',
		'node_modules/typescript/lib/lib.dom.d.ts',
		// Typings definitions for 3rd party libs
		'typings/index.d.ts'
	],
	src: {
		static: [
			'src/**/*.{svg,jpg,png,ico,txt}',
			'LICENSE',
			'README.md'
		],
		ts: ['src/app/**/*.ts'],
		css: ['src/**/*.css'],
		html: [
			'src/app/**/*.html',
			'src/index.html'
		]
	},
	dist: 'dist'
};


/**
 * Start a web server using BS and signal task done.
 * When the current process is stopped, the server will also be stopped.
 * See https://www.browsersync.io/docs
 */
gulp.task(function server(done) {
	bs.init(Object.assign(BS_CONFIG, {open: false, notify: false}), done);
	// When process exits kill browser-sync server
	process.on('exit', () => {
		bs.exit();
	});
});


/**
 * Copy JSPM config files
 */
gulp.task('jspm/config:copy', function () {
	return gulp
		.src([
			'jspm.config.js',
			'package.json'
		])
		.pipe(changed(PATHS.dist))
		.pipe(size(GULP_SIZE_DEFAULT_CONFIG))
		.pipe(gulp.dest(PATHS.dist));
});

/**
 * Update JSPM config:
 * 1. Set env production mode (enabled via `--production` option or via env var `ENABLE_PROD_MODE`)
 */
gulp.task('jspm/config:build', function () {
	// Set JSPM config path
	jspm.setPackagePath(PATHS.dist);
	// Load JSPM config
	jspmConfig.loadSync();
	// Get JSPM config
	const JSPM_CONFIG = jspmConfig.loader.getConfig();
	return gulp
		.src(`${PATHS.dist}/jspm.config.js`)
		.pipe(plumber())
		.pipe(updateEnv(JSPM_CONFIG))
		.pipe(size(GULP_SIZE_DEFAULT_CONFIG))
		.pipe(gulp.dest(PATHS.dist));
});

function updateEnv(config) {
	config.production = env.ENABLE_PROD_MODE || env.production || false;
	return through.obj((chunk, enc, callback) => {
		chunk.contents = new Buffer(`SystemJS.config(${JSON.stringify(config)})`, 'utf8');
		callback(null, chunk);
	});
}

/**
 * Install JSPM dependencies
 */
gulp.task('jspm/install', function () {
	let proc = exec(`${__dirname}/node_modules/.bin/jspm install`, {cwd: PATHS.dist});

	proc.stdout
		.pipe(split())
		.on('data', (data) => log(data));

	proc.stderr
		.pipe(split())
		.on('data', (data) => log(data));

	proc.on('close', () => {
		// Reload the browser.
		// Only when BS is running.
		bs.reload('jspm.config.js');
	});

	return proc;
});


/**
 * Build dependencies
 */
gulp.task('build/deps', gulp.series(
	'jspm/config:copy',
	'jspm/config:build',
	'jspm/install'
));


/**
 * Copy static assets
 */
gulp.task('build/static', function () {
	return gulp
		.src(PATHS.src.static, {
			base: './src'
		})
		.pipe(changed(PATHS.dist))
		.pipe(size(GULP_SIZE_DEFAULT_CONFIG))
		.pipe(gulp.dest(PATHS.dist))
		.pipe(bs.stream({
			match: '**/*.{svg,jpg,png,ico,txt}'
		}));
});


/**
 * Copy HTML
 */
gulp.task('build/html', function () {
	return gulp
		.src(PATHS.src.html, {
			base: './src'
		})
		.pipe(changed(PATHS.dist))
		.pipe(size(GULP_SIZE_DEFAULT_CONFIG))
		.pipe(gulp.dest(PATHS.dist))
		.pipe(bs.stream({
			match: '**/*.html'
		}));
});


/**
 * Build JS
 */
gulp.task('build/js', function () {
	return gulp
		.src([].concat(PATHS.typings, PATHS.src.ts), {
			base: './src'
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
		.pipe(gulp.dest(PATHS.dist))
		.pipe(bs.stream({
			match: '**/*.js'
		}));
});


/**
 * Build CSS
 */
gulp.task('build/css', function () {
	return gulp
		.src(PATHS.src.css, {
			base: './src'
		})
		.pipe(changed(PATHS.dist, {
			extension: '.css'
		}))
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(autoprefixer())
		.pipe(sourcemaps.write('.'))
		.pipe(size(GULP_SIZE_DEFAULT_CONFIG))
		.pipe(gulp.dest(PATHS.dist))
		.pipe(bs.stream({
			match: '**/*.css'
		}));
});


/**
 * Build everything
 */
gulp.task('build', gulp.parallel(
	'build/deps',
	'build/static',
	'build/html',
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
			tslint: require('tslint'), // Use a different version of tslint,
			formatter: "verbose"
		}))
		.pipe(tslint.report({
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
 * Update selenium webdriver
 */
gulp.task('webdriver/update', function () {
	const proc = spawn(
		process.platform === 'win32' ? 'node_modules\\.bin\\webdriver-manager' : 'node_modules/.bin/webdriver-manager',
		['update']
	);

	proc.stdout.pipe(split()).on('data', (line) => {
		console.log(line);
	});
	proc.stderr.pipe(split()).on('data', (line) => {
		console.log(line);
	});

	return proc;
});

/**
 * Run E2E tests locally on Chrome:
 * 1. Build the app
 * 2. Update selenium webdriver
 * 3. Start webserver
 * 4. Run tests
 */
gulp.task('test/e2e:local', gulp.series(
	gulp.parallel(
		'build',
		'webdriver/update'
	),
	'server',
	function test(done) {
		const proc = spawn(
			process.platform === 'win32' ? 'node_modules\\.bin\\protractor' : 'node_modules/.bin/protractor',
			['protractor.config.js']
		);

		proc.stdout.pipe(split()).on('data', (line) => {
			console.log(line);
		});
		proc.stderr.pipe(split()).on('data', (line) => {
			console.log(line);
		});

		proc.on('close', (error) => {
			if (error) {
				// Let gulp know that the tests failed
				done(new Error('Some specs have failed.'));
			} else {
				done();
			}
			process.exit(error);
		});
	}
));

/**
 * Run tests on SauceLabs browsers.
 * NOTE: Expects that SAUCE_USERNAME and SAUCE_ACCESS_KEY are set as env variables (or passed as args).
 * 1. Build the app
 * 2. Update selenium webdriver
 * 3. Start webserver
 * 4. Run tests
 */
gulp.task('test/e2e:sauce', gulp.series(
	gulp.parallel(
		'build',
		'webdriver/update'
	),
	'server',
	function test(done) {
		startSauceConnect().then((scp) => {
			let proc = spawn(
				process.platform === 'win32' ? 'node_modules\\.bin\\protractor' : 'node_modules/.bin/protractor',
				['protractor.config.js', '--sc']
			);

			proc.stdout.pipe(split()).on('data', (line) => {
				console.log(line);
			});
			proc.stderr.pipe(split()).on('data', (line) => {
				console.log(line);
			});

			proc.on('close', (error) => {
				scp.close();
				if (error) {
					// Let gulp know that the tests failed
					done(new Error('Some specs have failed.'));
				} else {
					done();
				}
				process.exit(error);
			});
		});
	}
));


/**
 * Firebase Deployments
 * NOTE: Make sure to run `gulp build --production` before you run this task.
 */
gulp.task(function deploy(done) {
	const TOKEN = process.env.FIREBASE_TOKEN || env.token;
	if (!TOKEN) {
		return done(new Error('No FIREBASE_TOKEN found in env or --token option passed.'));
	}

	log('Starting Firebase deployment ...');
	firebase.deploy({token: TOKEN}).then(
		() => {
			log(colors.green('Deployment successful'));
			done();
			process.exit();
		},
		(error) => {
			done(error);
			process.exit(1);
		});
});


/**
 * Serve app:
 * 1. Build app
 * 2. Watch for file changes and rebuild on change
 * 3. Start BS webserver
 */
gulp.task('serve', gulp.series(
	'build',
	function start() {
		// Start watching files for changes
		gulp.watch('jspm.config.js', gulp.task('build/deps')); // When a new jspm package was installed or the config changed, rerun deps build
		gulp.watch(PATHS.src.static, gulp.task('build/static'));
		gulp.watch(PATHS.src.html, gulp.task('build/html'));
		gulp.watch(PATHS.src.ts, gulp.task('build/js'));
		gulp.watch(PATHS.src.css, gulp.task('build/css'));
		// Start BS server
		bs.init(BS_CONFIG);
	}
));


/**
 * Default task
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
	log(colors.white('Starting sauce connect (might take a while) ...'));
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
