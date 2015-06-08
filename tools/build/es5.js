var applySourceMap = require('vinyl-sourcemaps-apply');
var assign = require('object-assign');
var compiler = require('./compiler');
var gutil = require('gulp-util');
var path = require('path');
var sourceMappingURL = require("source-map-url");
var traceur = require('traceur');
var through = require('through2');

var traceurDefaultOptions = {
    modules: 'instantiate',
    moduleName: true,
    sourceMaps: true
};

module.exports.build = compiler.build(compile, true);

function compile (opts) {
    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
			cb(null, file);
			return;
		}
		if (file.isStream()) {
            cb(new gutil.PluginError('es5:build', 'Streaming not supported'));
			return;
		}
		opts = assign({
			inputSourceMap: file.sourceMap
		}, traceurDefaultOptions, opts);
		try {
            var moduleName = parseModuleName(file);
			var compiler = new traceur.NodeCompiler(opts);
			var ret = compiler.compile(
                file.contents.toString(),
                // input/output file name must be the same to avoid sourceURL inside files https://github.com/google/traceur-compiler/issues/1748#issuecomment-75329693
                moduleName,
                moduleName,
                file.base
            );
			var sourceMap = file.sourceMap && compiler.getSourceMap();
            var extname = path.extname(file.path);
            if (ret) file.contents = new Buffer(
                sourceMappingURL.removeFrom(ret) // the sourcemap pipe will add this back with the correct path
            );
			if (sourceMap) {
                sourceMap.sources = sourceMap.sources.map(function (source) {
                    return source + extname; // the sources should have a file extension (since it was removed for setting the module name, we need to add it back)
                });
                sourceMap.file = sourceMap.file + extname; // the file should also have a file extension
                applySourceMap(file, sourceMap);
            }
			this.push(file);
		} catch (e) {
			this.emit('error', new gutil.PluginError('es5:build', Array.isArray(e) ? e.join('\n') : e, {
				fileName: file.path,
				showStack: false
			}));
		}
		cb();
	});
}

function parseModuleName (file) { // https://github.com/sindresorhus/gulp-traceur/issues/54
    var extname = path.extname(file.relative);
    var relPath = file.relative;
    return relPath.replace(extname, '');
}