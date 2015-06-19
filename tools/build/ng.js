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
            cb(new gutil.PluginError('ng:build', 'Streaming not supported'));
			return;
		}
        opts = opts || {};
		opts.traceurOptions = assign({
			inputSourceMap: file.sourceMap
		}, traceurDefaultOptions, opts.traceurOptions);
		try {
            var moduleName = parseModuleName(file, opts.namespace);
			var compiler = new traceur.NodeCompiler(opts.traceurOptions);
			var ret = compiler.compile(
                file.contents.toString(),
                // input/output file name must be the same to avoid sourceURL inside files https://github.com/google/traceur-compiler/issues/1748#issuecomment-75329693
                moduleName,
                moduleName,
                file.base
            );
			var sourceMap = file.sourceMap && compiler.getSourceMap();
            if (ret) file.contents = new Buffer(ret);
			if (sourceMap) {
                applySourceMap(file, sourceMap);
            }
			this.push(file);
		} catch (e) {
			this.emit('error', new gutil.PluginError('ng:build', Array.isArray(e) ? e.join('\n') : e, {
				fileName: file.path,
				showStack: false
			}));
		}
		cb();
	});
}

function parseModuleName (file, namespace) { // https://github.com/sindresorhus/gulp-traceur/issues/54
    var extname = path.extname(file.relative);
    var relPath = file.relative;
    return (namespace ? namespace + '/' : '') + relPath.replace(extname, '');
}