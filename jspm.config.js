SystemJS.config({
	production: false,
	transpiler: false,
	nodeConfig: {
		'paths': {
			'github:': '/jspm_packages/github/',
			'npm:': '/jspm_packages/npm/'
		}
	},
	browserConfig: {
		'paths': {
			'github:': '/jspm_packages/github/',
			'npm:': '/jspm_packages/npm/'
		}
	},
	productionConfig: {},
	map: {
		'env': './env.js',
		'main': './main.js',
		'app/*': '/app/*'
	},
	packages: {
		// './env': {
		// 	'map': {
		// 		'*': {
		// 			'~production': './env.dev'
		// 		}
		// 	}
		// },
		// 'app': {
		'app': {
			// 'format': 'cjs',
			// 'map': {
			// 	'./env': {
			// 		'~production': './env.dev'
			// 	}
			// }
		}
	}
});

SystemJS.config({
	packageConfigPaths: [
		'npm:@*/*.json',
		'npm:*.json',
		'github:*/*.json'
	],
	map: {
		'@angular/common': 'npm:@angular/common@2.0.0-rc.4',
		'@angular/compiler': 'npm:@angular/compiler@2.0.0-rc.4',
		'@angular/core': 'npm:@angular/core@2.0.0-rc.4',
		'@angular/http': 'npm:@angular/http@2.0.0-rc.4',
		'@angular/platform-browser': 'npm:@angular/platform-browser@2.0.0-rc.4',
		'@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic@2.0.0-rc.4',
		'@angular/router': 'npm:@angular/router@3.0.0-beta.2',
		'core-js': 'npm:core-js@2.4.1',
		'fs': 'github:jspm/nodelibs-fs@0.2.0-alpha',
		'os': 'github:jspm/nodelibs-os@0.2.0-alpha',
		'path': 'github:jspm/nodelibs-path@0.2.0-alpha',
		'process': 'github:jspm/nodelibs-process@0.2.0-alpha',
		'reflect-metadata': 'npm:reflect-metadata@0.1.3',
		'rxjs': 'npm:rxjs@5.0.0-beta.6',
		'zone.js': 'npm:zone.js@0.6.12'
	},
	packages: {
		'github:jspm/nodelibs-os@0.2.0-alpha': {
			'map': {
				'os-browserify': 'npm:os-browserify@0.2.1'
			}
		}
	}
});
