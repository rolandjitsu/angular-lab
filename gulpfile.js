/// <reference path="typings/node/node.d.ts"/>

var assign = require('object-assign');
var autoprefixer = require('gulp-autoprefixer');
var bower = require('bower');
var changed = require('gulp-changed');
var connect = require('gulp-connect');
var del = require('del');
var exec = require('child_process').exec;
var gulp = require('gulp');
var gutil = require('gulp-util');
var karma = require('karma');
var minimist = require('minimist');
var plumber = require('gulp-plumber');
var Q = require('q');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var size = require('gulp-size');
var sourcemaps = require('gulp-sourcemaps');
var tslint = require('gulp-tslint');
var tsd = require('tsd');
var ts = require('gulp-typescript');
var watch = require('gulp-watch');

var karmaConf = {
	configFile: __dirname + '/karma.conf.js'
};
var sauceConf = require('./sauce.conf');

var ENGINE_IO_BASE_SERVER_ADDRESS = 'ws://localhost:';
var TS_BUILD_SERVER_PORT = 6174; // Kaprekar's constant
var TS_BUILD_SERVER_ADDRESS = ENGINE_IO_BASE_SERVER_ADDRESS + TS_BUILD_SERVER_PORT;

var PLAY_SERVER_PORT = 1729; // Hardy–Ramanujan number
var PLAY_SERVER_ADDRESS = ENGINE_IO_BASE_SERVER_ADDRESS + PLAY_SERVER_PORT;

var PATHS = {
	lib: [
		'bower_components/normalize.css/normalize.css',
		'bower_components/firebase/firebase.js',
		'node_modules/traceur/bin/traceur-runtime.js',
		'node_modules/systemjs/dist/system.*',
		'node_modules/reflect-metadata/Reflect.js',
		'node_modules/reflect-metadata/Reflect.js.map',
		'node_modules/zone.js/dist/zone.js',
		'node_modules/zone.js/dist/long-stack-trace-zone.js',
		'node_modules/rx/dist/rx.js'
	],
	typings: [
		'node_modules/angular2/ts/traceur-runtime.d.ts',
		'typings/tsd.d.ts',
		'src/_typings/custom.d.ts'
	],
	src: {
		root: '/src',
		ts: [
			'!src/_typings/custom.d.ts',
			'src/**/*.ts'
		],
		html: 'src/**/*.html',
		css: 'src/**/*.css',
		static: 'src/**/*.{svg,jpg,png,ico}',
		spec: [
			'src/**/*.spec.ts'
		]
	},
	dist: 'dist'
};

var ng2play = ts.createProject('tsconfig.json', {
	typescript: require('typescript')
});

gulp.task('clean', function (done) {
	del([PATHS.dist], done);
});


// Dependecies

gulp.task('bower', function (done) {
	bower
		.commands
		.install(null, { save: true }, { interactive: false })
		.on('error', console.error.bind(console))
		.on('end', function () {
			done();
		});
});

gulp.task('tsd', function () {
	var tsdAPI = tsd.getAPI('tsd.json');
	return tsdAPI.readConfig({}, true).then(function () {
		return tsdAPI.reinstall(
			tsd.Options.fromJSON({}) // https://github.com/DefinitelyTyped/tsd/blob/bb2dc91ad64f159298657805154259f9e68ea8a6/src/tsd/Options.ts
		).then(function () {
			return tsdAPI.updateBundle(tsdAPI.context.config.bundle, true);
		});
	});
});

gulp.task('deps/angular2', function () {
	var angular2Path = PATHS.dist + '/lib/angular2';
	return gulp
		.src([
			'!node_modules/angular2/es6/**',
			'!node_modules/angular2/node_modules/**',
			'!node_modules/angular2/angular2_sfx.js',
			'!node_modules/angular2/angular2_sfx.js.map',
			'node_modules/angular2/**/*.js',
			'node_modules/angular2/**/*.map'
		])
		.pipe(changed(angular2Path))
		.pipe(size({
			showFiles: true,
			gzip: true
		}))
		.pipe(gulp.dest(angular2Path));
});

gulp.task('deps', ['bower', 'tsd', 'deps/angular2'], function () {
	var libsPath = PATHS.dist + '/lib';
	return gulp
		.src(PATHS.lib)
		.pipe(changed(libsPath))
		.pipe(rename(function (file) {
			file.basename = file.basename.toLowerCase(); // Firebase is case sensitive, thus we lowercase all for ease of access
		}))
		.pipe(size({
			showFiles: true,
			gzip: true
		}))
		.pipe(gulp.dest(libsPath));
});


// Build

var tsBuildSocket;
gulp.task('build/js', function (done) {
	if (tsBuildSocket) {
		var stream = buildJs();
		stream.on('end', function () {
			tsBuildSocket.send('build/js:done');
			done();
		});
	}
	else {
		isEngineIOServerRunning(TS_BUILD_SERVER_PORT).then(
			function () {
				tsBuildSocket = require('engine.io-client')(TS_BUILD_SERVER_ADDRESS);
				tsBuildSocket.on('open', function () {
					var stream = buildJs();
					stream.on('end', function () {
						tsBuildSocket.send('build/js:done');
						done();
					});
				});
			},
			function () {
				var stream = buildJs();
				stream.on('end', function () {
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
		.pipe(size({
			showFiles: true,
			gzip: true
		}))
		.pipe(gulp.dest(PATHS.dist));
});

gulp.task('build/css', function () {
	return gulp
		.src(PATHS.src.css)
		.pipe(changed(PATHS.dist, { extension: '.css' }))
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(autoprefixer())
		.pipe(sourcemaps.write('.'))
		.pipe(size({
			showFiles: true,
			gzip: true
		}))
		.pipe(gulp.dest(PATHS.dist));
});

gulp.task('serve/static', function () {
	return gulp
		.src(PATHS.src.static)
		.pipe(changed(PATHS.dist))
		.pipe(size({
			showFiles: true,
			gzip: true
		}))
		.pipe(gulp.dest(PATHS.dist));
});

gulp.task('bundle', function (done) {
	runSequence('deps', ['build/js', 'serve/html', 'build/css', 'serve/static'], done);
});

gulp.task('bundle/!ipsr', function (done) { // Bundle if play server is not running
	isEngineIOServerRunning(PLAY_SERVER_PORT).then(function () { done(); }, function () {
		runSequence('bundle', done);
	});
}),


// Code integrity

gulp.task('lint', function () { // https://github.com/palantir/tslint#supported-rules
	return gulp
		.src(PATHS.src.ts)
		.pipe(plumber())
		.pipe(tslint())
		.pipe(tslint.report('prose', {
			emitError: false
		}));
});


// Tests

gulp.task('test:unit/ci', function (done) {
	var browserConf = getBrowsersConfigFromCLI();
	var config = assign({}, karmaConf, {
		singleRun: true,
		reporters: [
			'dots'
		],
		browsers: browserConf.browsers
	});
	var server = new karma.Server(config, function (err) {
		done();
		process.exit(err ? 1 : 0);
	});
	server.start();
});

gulp.task('test:unit/single', function (done) { // Run unit tests once in local env
	var config = assign({}, karmaConf, {
		singleRun: true
	});
	var server = new karma.Server(config, done);
	server.start();
});

gulp.task('test:unit/ci:sauce', function (done) {
	var config = assign({}, karmaConf, {
		singleRun: true,
		browserNoActivityTimeout: 240000,
		captureTimeout: 120000,
		reporters: [
			'dots',
			'saucelabs'
		],
		browsers: sauceConf.aliases.CI
	});
	var server = new karma.Server(config, function (err) {
		done();
		process.exit(err ? 1 : 0);
	});
	server.start();
});

gulp.task('test:unit/sauce', ['bundle/!ipsr'], function (done) {
	var browserConf = getBrowsersConfigFromCLI();
	var config = assign({}, karmaConf, {
		singleRun: true,
		browserNoActivityTimeout: 240000,
		captureTimeout: 120000,
		reporters: [
			'dots'
		],
		browsers: browserConf.browsers
	});
	if (!browserConf.isSauce) {
		gutil.log(gutil.colors.red('There were no Saucelabs browsers provided, add them with the --browsers option'));
		done();
		process.exit(1);
	} else {
		var server = new karma.Server(config, function (err) {
			done();
			process.exit(err ? 1 : 0);
		});
		server.start();
	}
});

gulp.task('test:unit/karma-server', function () {
	var server = new karma.Server(karmaConf);
	server.start();
});

gulp.task('test:unit/karma-run', function (done) {
	// run the run command in a new process to avoid duplicate logging by both server and runner from a single process	
	runKarma('karma.conf.js', done);
});

gulp.task('test:unit', ['bundle/!ipsr'], function (done) {
	runSequence(
		'test:unit/karma-server',
		function () {
			// Create a server to avoid parallel ts builds when running unit tests in another process
			// If the ts build server is shut down from some other process (the same process that started it), restart it here
			createTSBuildServer(function () {
				createTSBuildServer();
			}).then(function () {
				var client = require('engine.io-client')(TS_BUILD_SERVER_ADDRESS);
				client.on('open', function () {
					client.on('message', function (msg) {
						if (msg === 'build/js:done') runSequence('test:unit/karma-run');
					});
				});
			});
		}
	);
});

gulp.task('test', ['bundle/!ipsr'], function (done) {
	runSequence(
		'test:unit/single',
		'lint',
		done
	);
});


// Play

gulp.task('play', function (done) {
	isEngineIOServerRunning(PLAY_SERVER_PORT).then(
		function () {
			gutil.log(gutil.colors.red('A play instance has already been started in another process, cannot start another one'));
			done();
			process.exit(1);
		},
		function () {
			runSequence('bundle', function () {
				// Create a server to avoid parallel ts builds when running unit tests in another process
				// If the ts build server is shut down from some other process (the same process that started it), restart it here
				createTSBuildServer(function () {
					createTSBuildServer();
				});
				createPlayServer();
				connect.server({
					root: PATHS.dist,
					port: 8000
				});
				gutil.log(gutil.colors.yellow('File watch processes for HTML, CSS & static assets started'));
				watch(PATHS.src.html, function () {
					runSequence('serve/html');
				});
				watch(PATHS.src.css, function () {
					runSequence('build/css');
				});
				watch(PATHS.src.static, function () {
					runSequence('serve/static');
				});
			});
		}
	);
});

gulp.task('default', [
	'play'
]);

process.on('SIGINT', function () {
	process.exit(); // Call process.exit() explicitly on ctl-c so that we actually get that event
});


function runKarma (configFile, done) {
	var cmd = process.platform === 'win32' ? 'node_modules\\.bin\\karma run ' : 'node node_modules/.bin/karma run ';
	cmd += configFile;
	exec(cmd, function (e, stdout) {
		// ignore errors, we don't want to fail the build in the interactive (non-ci) mode
		// karma server will print all test failures
		done();
	});
}

function getBrowsersConfigFromCLI () {
	var isSauce = false;
	var args = minimist(process.argv.slice(2));
	var rawInput = args.browsers ? args.browsers : 'CHROME_TRAVIS_CI';
	var inputList = rawInput.replace(' ', '').split(',');
	var outputList = [];
	for (var i = 0; i < inputList.length; i++) {
		var input = inputList[i];
		if (sauceConf.launchers.hasOwnProperty(input)) {
			// Non-sauce browsers case: overrides everything, ignoring other options
			outputList = [input];
			isSauce = false;
			break;
		} else if (sauceConf.launchers.hasOwnProperty("SL_" + input.toUpperCase())) {
			isSauce = true;
			outputList.push("SL_" + input.toUpperCase());
		} else if (sauceConf.aliases.hasOwnProperty(input.toUpperCase())) {
			outputList = outputList.concat(sauceConf.aliases[input]);
			isSauce = true;
		} else throw new Error('ERROR: unknown browser found in getBrowsersConfigFromCLI()');
	}
	return {
		browsers: outputList.filter(function (item, pos, self) {
			return self.indexOf(item) == pos;
		}),
		isSauce: isSauce
	}
}

function buildJs () {
	return gulp
		.src(PATHS.src.ts.slice(-1).concat(PATHS.typings)) // instead of gulp.src(...), project.src() can be used
		.pipe(changed(PATHS.dist, { extension: '.js' }))
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(ts(ng2play))
		.js
		.pipe(sourcemaps.write('.'))
		.pipe(size({
			showFiles: true,
			gzip: true
		}))
		.pipe(gulp.dest(PATHS.dist));
} 

function createPlayServer () {
	var server = engineIOServer(PLAY_SERVER_PORT, function () {
		gutil.log(gutil.colors.magenta('Play server started ' + PLAY_SERVER_ADDRESS));
	});
	process.on('exit', function() {
		server.close();
	});
}

function createTSBuildServer (onShutdown) {
	var defer = Q.defer();
	isEngineIOServerRunning(TS_BUILD_SERVER_PORT).then(
		function () {
			var client = require('engine.io-client')(TS_BUILD_SERVER_ADDRESS);
			client.on('open', function () {
				client.on('close', function (msg) {
					if (typeof onShutdown === 'function') onShutdown();
				});
			});
			gutil.log(gutil.colors.magenta('TS build server already running on ' + TS_BUILD_SERVER_ADDRESS));
			defer.resolve();
		},
		function () {
			var watcher = watch(PATHS.src.ts, function () {
				runSequence('build/js');
			});
			var server = engineIOServer(TS_BUILD_SERVER_PORT, function () {
				gutil.log(gutil.colors.magenta('TS build server started ' + TS_BUILD_SERVER_ADDRESS));
				defer.resolve();
			});
			server.on('connection', function (socket) {
				socket.on('message', function (msg) {
					server.broadcast(msg, socket.id);
				});
			});
			process.on('exit', function() {
				watcher.close();
				server.close();
			});
		}
	);
	return defer.promise;
}

function engineIOServer (port, done) {
	var server = require('engine.io').listen(port, typeof done === 'function' ? done : noop);
	// Send message to everyone but (optionally) the sender
	server.broadcast = function (msg, skipId) {
		for (var id in server.clients) {
			if (typeof skipId !== 'undefined') {
				if (id == skipId) continue; // Don't broadcast to sender
			}
			server.clients[id].send(msg);
		}
	}
	return server;
}

function isEngineIOServerRunning (port, timeout) {
	var defer = Q.defer();
	var timer = setTimeout(function () {
		defer.reject();
		client.close();
	}, timeout || 500);
	var client = require('engine.io-client')(ENGINE_IO_BASE_SERVER_ADDRESS + port);
	client.on('open', function () {
		clearTimeout(timer);
		defer.resolve();
		client.close();
	});
	client.on('close', function () {
		clearTimeout(timer);
		defer.reject();
	});
	return defer.promise;
}

function noop () {}