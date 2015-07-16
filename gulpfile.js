var autoprefixer = require('gulp-autoprefixer');
var bower = require('bower');
var changed = require('gulp-changed');
var connect = require('gulp-connect');
var del = require('del');
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var size = require('gulp-size');
var sourcemaps = require('gulp-sourcemaps');
var tslint = require('gulp-tslint');
var tsd = require('tsd');
var ts = require('gulp-typescript');
var watch = require('gulp-watch');

var PATHS = {
	lib: [
		'bower_components/normalize.css/normalize.css',
		'bower_components/firebase/firebase.js',
		'node_modules/traceur/bin/traceur-runtime.js',
		'node_modules/systemjs/dist/system.*',
		'node_modules/reflect-metadata/Reflect.js',
		'node_modules/zone.js/dist/zone.js',
		'node_modules/zone.js/dist/long-stack-trace-zone.js',
		'node_modules/rx/dist/rx.js'
	],
	typings: [
		'src/_typings/custom.d.ts',
		'typings/tsd.d.ts'
	],
	src: {
		root: '/src',
		ts: ['!src/_typings/custom.d.ts', 'src/**/*.ts'],
		html: 'src/**/*.html',
		css: 'src/**/*.css',
		static: 'src/**/*.{svg,jpg,png,ico}'
	},
	dist: 'dist'
};

var ng2play = ts.createProject('tsconfig.json', {
	typescript: require('typescript')
});

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
	return gulp
		.src([
			'!node_modules/angular2/es6/**',
			'!node_modules/angular2/node_modules/**',
			'!node_modules/angular2/angular2_sfx.js',
			'node_modules/angular2/**/*.js'
		])
		.pipe(size({
			showFiles: true,
			gzip: true
		}))
		.pipe(gulp.dest(PATHS.dist + '/lib/angular2'));
});

gulp.task('libs', ['bower', 'tsd', 'angular2'], function () {
	return gulp
		.src(PATHS.lib)
		.pipe(rename(function (file) {
			file.basename = file.basename.toLowerCase(); // Firebase is case sensitive, thus we lowercase all for ease of access
		}))
		.pipe(size({
			showFiles: true,
			gzip: true
		}))
		.pipe(gulp.dest(PATHS.dist + '/lib'));
});

gulp.task('ts', function () {
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
});

gulp.task('html', function () {
	return gulp
		.src(PATHS.src.html)
		.pipe(changed(PATHS.dist))
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

gulp.task('static', function () {
	return gulp
		.src(PATHS.src.static)
		.pipe(changed(PATHS.dist))
		.pipe(size({
			showFiles: true,
			gzip: true
		}))
		.pipe(gulp.dest(PATHS.dist));
});

gulp.task('lint', function () { // https://github.com/palantir/tslint#supported-rules
	return gulp
		.src(PATHS.src.ts)
		.pipe(plumber())
		.pipe(tslint())
		.pipe(tslint.report('prose', {
			emitError: false
		}));
});

gulp.task('bundle', function (done) {
	runSequence('clean', 'libs', ['ts', 'html', 'css', 'static'], done);
});

gulp.task('play', ['bundle'], function () {
	watch(PATHS.src.ts, function () {
		gulp.start('ts');
	});
	watch(PATHS.src.html, function () {
		gulp.start('html');
	});
	watch(PATHS.src.css, function () {
		gulp.start('css');
	});
	watch(PATHS.src.static, function () {
		gulp.start('static');
	});	
	connect.server({
		root: PATHS.dist,
		port: 8000
	});
});

gulp.task('default', ['bundle']);