var changed = require('gulp-changed');
var concat = require('gulp-concat');
var gulp = require('gulp');
var gutil = require('gulp-util');
var path = require('path');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');

module.exports.build = build;

function build (compile, withSourceMaps) {
	return function (src, dest, config) {
		var filename;
	    var extname = path.extname(dest);
	    if (extname.length) dest = dest.replace(filename = path.basename(dest), '')
	    return gulp
	        .src(src)
	        .pipe(changed(dest, { extension: '.js' }))
	        .pipe(plumber())
	        .pipe(
				withSourceMaps // https://www.npmjs.com/package/gulp-sourcemaps#plugin-developers-only-how-to-add-source-map-support-to-plugins
	                ? sourcemaps.init({ loadMaps: true })
	                : gutil.noop()
	        )
	        .pipe(compile(config))
	        .pipe(
	            extname.length
	                ? concat(filename)
	                : gutil.noop()
	        )
	        .pipe(rename({
	            extname: '.js'
			}))
	        .pipe(
				withSourceMaps
	                ? sourcemaps.write('.', {
	                    sourceRoot: '.'
	                })
	                : gutil.noop()
	        )
	        .pipe(require('gulp-size')({
				showFiles: true,
				gzip: true
			}))
	        .pipe(gulp.dest(dest));
	};
}