module.exports.bundle = function bundle (builderConfig, moduleName, dest, buildConfig) {
	var Builder = require('systemjs-builder');
	var builder = new Builder();
	builder.config(builderConfig);
	return builder.build(moduleName, dest, buildConfig);
};