var Builder = require('systemjs-builder');
var del = require('del');
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var traceur = require('gulp-traceur');

var PATHS = {
	lib: [
		'node_modules/gulp-traceur/node_modules/traceur/bin/traceur-runtime.js',
		'node_modules/es6-module-loader/dist/es6-module-loader-sans-promises.src.js',
		'node_modules/systemjs/lib/extension-register.js',
		'node_modules/reflect-metadata/reflect.js',
		'node_modules/angular2/node_modules/zone.js/dist/zone.js',
		'node_modules/angular2/node_modules/zone.js/dist/long-stack-trace-zone.js'
	],
	src: {
		css: 'src/**/*.css',
		html: 'src/**/*.html',
		js: 'src/**/*.js'
	}
};

gulp.task('clean', function (done) {
	del(['dist'], done);
});

gulp.task('angular2', function () {
	var builder = new Builder({
		paths: {
			"angular2/*": "node_modules/angular2/es6/prod/*.es6",
			"rx": "node_modules/angular2/node_modules/rx/dist/rx.js"
		},
		meta: {
			// auto-detection fails to detect properly here - https://github.com/systemjs/builder/issues/123
			'rx': {
				format: 'cjs'
			}
		}
	});
	return builder.build('angular2/angular2 + angular2/router', 'dist/lib/angular2.js', {});
});

gulp.task('libs', ['angular2'], function () {
	return gulp
		.src(PATHS.lib)
		.pipe(
			require('gulp-size')({showFiles: true, gzip: true})
		)
		.pipe(
			gulp.dest('dist/lib')
		);
});

gulp.task('html', function () {
	return gulp
		.src(PATHS.src.html)
		.pipe(
			gulp.dest('dist')
		);
});

gulp.task('css', function () {
	return gulp
		.src(PATHS.src.css)
		.pipe(
			gulp.dest('dist')
		);
});

gulp.task('js', function () {
	return gulp
		.src(PATHS.src.js)
		.pipe(
			rename({ extname: '' }) // hack, see: https://github.com/sindresorhus/gulp-traceur/issues/54
		)
		.pipe(
			plumber()
		)
		.pipe(
			traceur({
				modules: 'instantiate',
				moduleName: true,
				annotations: true,
				types: true,
				memberVariables: true
			})
		)
		.pipe(
			rename({ extname: '.js' }) // hack, see: https://github.com/sindresorhus/gulp-traceur/issues/54
		)
		.pipe(
			gulp.dest('dist')
		);
});

gulp.task('play', ['default'], function () {
		var http = require('http');
		var connect = require('connect');
		var serveStatic = require('serve-static');
		var port = 8000;
		var app;
		gulp.watch(PATHS.src.css, ['css']);
		gulp.watch(PATHS.src.html, ['html']);
		gulp.watch(PATHS.src.js, ['js']);
		app = connect();
		app.use(
			serveStatic(__dirname + '/dist')
		)
		http
			.createServer(app)
			.listen(port, function () {
				console.log('\nServer listening on port', port + '\n');
			});
});

gulp.task('default', [
	'libs',
	'html',
	'css',
	'js'
]);