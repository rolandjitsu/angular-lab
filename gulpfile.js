var bower = require('bower');
var bundler = require('./tools/build/bundler');
var changed = require('gulp-changed');
var connect = require('gulp-connect');
var del = require('del');
var es5 = require('./tools/build/es5');
var gulp = require('gulp');
var ng = require('./tools/build/ng');
var rename = require('gulp-rename');
var size = require('gulp-size');
var watch = require('gulp-watch');

var PATHS = {
	lib: [
		'bower_components/normalize-css/normalize.css',
		'bower_components/firebase/firebase.js',
		'node_modules/es6-module-loader/dist/es6-module-loader-sans-promises.*',
		'node_modules/reflect-metadata/Reflect.js',
		'node_modules/systemjs/lib/extension-register.js',
		'node_modules/traceur/bin/traceur-runtime.js',
		'node_modules/zone.js/dist/zone.js',
		'node_modules/zone.js/dist/long-stack-trace-zone.js'
	],
	src: {
		root: '/src',
		js: 'src/**/*.{js,es6}',
		html: 'src/**/*.html',
		css: 'src/**/*.css'
	},
	dist: 'dist'
};

var bundleConfig = {
	paths: {
		"rx": "node_modules/rx/dist/rx.js"
	},
	meta: {
		// auto-detection fails to detect properly here - https://github.com/systemjs/builder/issues/123
		'rx': {
			format: 'cjs'
		}
	}
};

gulp.task('clean', function (done) {
	del([PATHS.dist], done);
});

gulp.task('bower', function (done) {
	bower
		.commands
		.install(null, { save: true }, { interactive: false })
		.on('error', console.error.bind(console))
		.on('end', function () {
			done();
		});
});

gulp.task('angular2', function () {
	return ng.build(
		[
			'!node_modules/angular2/es6/prod/angular2_sfx.es6',
			'node_modules/angular2/es6/prod/**/*.es6'
		],
		PATHS.dist + '/lib/angular2.js',
		{
			namespace: 'angular2',
			traceurOptions: {}
		}
	);
});

gulp.task('rx', function () {
	return bundler.bundle(bundleConfig, 'rx', PATHS.dist + '/lib/rx.js');
});

gulp.task('libs', ['bower', 'rx', 'angular2'], function () {
	return gulp
		.src(PATHS.lib)
		.pipe(rename(function (file) {
			file.basename = file.basename.toLowerCase() // Firebase is case sensitive, thus we lowercase all for ease of access
		}))
		.pipe(size({
			showFiles: true,
			gzip: true
		}))
		.pipe(gulp.dest(PATHS.dist + '/lib'));
});

gulp.task('js', function () {
	return es5.build(
		PATHS.src.js,
		PATHS.dist,
		{
			annotations: true,
			memberVariables: true,
			types: true
		}
	);
});

gulp.task('html', function () {
	return gulp
		.src(PATHS.src.html)
		.pipe(changed(PATHS.dist, { extension: '.html' }))
		.pipe(size({
			showFiles: true,
			gzip: true
		}))
		.pipe(gulp.dest(PATHS.dist));
});

gulp.task('css', function () {
	return gulp
		.src(PATHS.src.css)
		.pipe(changed(PATHS.dist, { extension: '.css' }))
		.pipe(size({
			showFiles: true,
			gzip: true
		}))
		.pipe(gulp.dest(PATHS.dist));
});

gulp.task('play', ['default'], function () {
	watch(PATHS.src.js, function () {
		gulp.start('js');
	});
	watch(PATHS.src.html, function () {
		gulp.start('html');
	});
	watch(PATHS.src.css, function () {
		gulp.start('css');
	});
	connect.server({
		root: PATHS.dist,
		port: 8000,
		fallback: PATHS.dist + '/index.html'
	});
});

gulp.task('default', [
	'libs',
	'js',
	'html',
	'css'
]);