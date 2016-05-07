SystemJS.config({
	trace: false,
	production: false,
	transpiler: 'ts',
	typescriptOptions: {
		'typeCheck': true,
		'tsconfig': true
	},
	paths: {
		'github:*': '/jspm_packages/github/*',
		'npm:*': '/jspm_packages/npm/*'
	},
	packages: {
		'test': {
			'defaultExtension': 'ts'
		},
		'app': {
			'defaultExtension': 'ts',
			'map': {
				'./env': {
					'~production': './env.dev'
				}
			}
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
		'@angular/common': 'npm:@angular/common@2.0.0-rc.1',
		'@angular/compiler': 'npm:@angular/compiler@2.0.0-rc.1',
		'@angular/core': 'npm:@angular/core@2.0.0-rc.1',
		'@angular/http': 'npm:@angular/http@2.0.0-rc.1',
		'@angular/platform-browser': 'npm:@angular/platform-browser@2.0.0-rc.1',
		'@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic@2.0.0-rc.1',
		'@angular/router': 'npm:@angular/router@2.0.0-rc.1',
		'core-js': 'npm:core-js@2.3.0',
		'firebase': 'github:firebase/firebase-bower@2.4.2',
		'fs': 'github:jspm/nodelibs-fs@0.2.0-alpha',
		'os': 'github:jspm/nodelibs-os@0.2.0-alpha',
		'path': 'github:jspm/nodelibs-path@0.2.0-alpha',
		'process': 'github:jspm/nodelibs-process@0.2.0-alpha',
		'reflect-metadata': 'npm:reflect-metadata@0.1.3',
		'rxjs': 'npm:rxjs@5.0.0-beta.6',
		'ts': 'github:frankwallis/plugin-typescript@4.0.9',
		'zone.js': 'npm:zone.js@0.6.12'
	},
	packages: {
		'github:frankwallis/plugin-typescript@4.0.9': {
			'map': {
				'typescript': 'npm:typescript@1.8.10'
			}
		},
		'github:jspm/nodelibs-os@0.2.0-alpha': {
			'map': {
				'os-browserify': 'npm:os-browserify@0.2.1'
			}
		}
	}
});
