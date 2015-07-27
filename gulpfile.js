/* global __dirname */
/* global process */
/* global Q */

var autoprefixer = require('gulp-autoprefixer');
var bower = require('bower');
var changed = require('gulp-changed');
var connect = require('gulp-connect');
var del = require('del');
var exec = require('child_process').exec;
var gulp = require('gulp');
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

var PORT = 1729;

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

gulp.task('angular2', function () {
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

gulp.task('deps', ['bower', 'tsd', 'angular2'], function () {
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

var jsBuildSocket;
gulp.task('build/js', function (done) {
	if (jsBuildSocket) {
		var stream = buildJs();
		stream.on('end', function () {
			jsBuildSocket.send('build/js');
			done();
		});
	}
	else {
		isServerRunning().then(
			function () {
				jsBuildSocket = require('engine.io-client')('ws://localhost:' + PORT);
				jsBuildSocket.on('open', function () {
					var stream = buildJs();
					stream.on('end', function () {
						jsBuildSocket.send('build/js');
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
	var config = {
		configFile: __dirname + '/karma.conf.js',
		singleRun: true,
		reporters: [
			'dots'
		],
		browsers: getBrowsersFromCLI()
	};
	var server = new karma.Server(config, done);
	server.start();
});

gulp.task('test:unit/karma-server', function () {
	var server = new karma.Server({
		configFile: __dirname + '/karma.conf.js'
	});
	server.start();
});

gulp.task('test:unit/karma-run', function (done) {
	// run the run command in a new process to avoid duplicate logging by both server and runner from a single process	
	runKarma('karma.conf.js', done);
});

gulp.task('test:unit', function (done) {
	isServerRunning().then(
		function () {
			runSequence(
				'test:unit/karma-server',
				function () {
					var client = require('engine.io-client')('ws://localhost:' + PORT);
					client.on('open', function () {
						client.on('message', function () {
							runSequence('test:unit/karma-run');
						});
					});
				}
			);
		},
		function () {
			runSequence(
				'bundle',
				'test:unit/karma-server',
				function () {
					watch(PATHS.src.spec, function () {
						runSequence(
							'build/js',
							'test:unit/karma-run'
						);
					});
				}
			);
		}
	);
});

gulp.task('test', function () {
	runSequence(
		'test:unit/ci',
		'lint'
	);
});


// Play

gulp.task('play', ['bundle'], function (done) {
	// Create a server to avoid parallel ts builds when running unit tests in another process
	isServerRunning().then(null, createServer);
	watch(PATHS.src.ts, function () {
		runSequence('build/js');
	});
	watch(PATHS.src.html, function () {
		runSequence('serve/html');
	});
	watch(PATHS.src.css, function () {
		runSequence('build/css');
	});
	watch(PATHS.src.static, function () {
		runSequence('serve/static');
	});	
	connect.server({
		root: PATHS.dist,
		port: 8000
	});
});

gulp.task('default', [
	'play'
]);

// Call process.exit() explicitly on ctl-c so that we actually get that event
process.on('SIGINT', function () {
	process.exit();
});

function runKarma (configFile, done) {
	var cmd = process.platform === 'win32' ? 'node_modules\\.bin\\karma run ' : 'node node_modules/.bin/karma run ';
	cmd += configFile;
	exec(cmd, function(e, stdout) {
		// ignore errors, we don't want to fail the build in the interactive (non-ci) mode
		// karma server will print all test failures
		done();
	});
}

function getBrowsersFromCLI () {
	var args = minimist(process.argv.slice(2));
	return [
		args.browsers ? args.browsers : 'Chrome'
	]
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

function isServerRunning () {
	var defer = Q.defer();
	var timer = setTimeout(function () {
		defer.reject();
		client.close();
	}, 2500);
	var client = require('engine.io-client')('ws://localhost:' + PORT);
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

function createServer () {
	var server = require('engine.io').listen(PORT);
	// Send message to everyone but (optionally) the sending client
	server.broadcast = function (mssg, id) {
		for (var key in server.clients) {
			if (typeof id !== 'undefined') {
				if (key == id) continue; // Don't broadcast to sending client
			}
			server.clients[key].send(mssg);
		}
	}
	server.on('connection', function (socket) {
		socket.on('message', function () {
			server.broadcast('', socket.id);
		});
	});
	process.on('exit', function() {
		server.close();
	});
}