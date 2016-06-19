SystemJS.config({
	browserConfig: {
		"paths": {
			"github:": "/jspm_packages/github/",
			"npm:": "/jspm_packages/npm/",
			"app/": "/app/"
		}
	},
	nodeConfig: {
		"paths": {
			"github:": "jspm_packages/github/",
			"npm:": "jspm_packages/npm/",
			"app/": "app/"
		}
	},
	devConfig: {
		"map": {
			"plugin-babel": "npm:systemjs-plugin-babel@0.0.12",
			"plugin-typescript": "github:frankwallis/plugin-typescript@4.0.16"
		},
		"packages": {
			"github:frankwallis/plugin-typescript@4.0.16": {
				"map": {
					"typescript": "npm:typescript@1.8.10"
				}
			}
		}
	},
	transpiler: "plugin-typescript",
	typescriptOptions: {
		"module": "system",
		"typeCheck": true,
		"tsconfig": true
	},
	packages: {
		"app": {
			"defaultExtension": "ts",
			"map": {
				"./env": {
					"~production": "./env.dev"
				}
			}
		}
	}
});

SystemJS.config({
	packageConfigPaths: [
		"github:*/*.json",
		"npm:@*/*.json",
		"npm:*.json"
	],
	map: {
		"@angular/common": "npm:@angular/common@2.0.0-rc.2",
		"@angular/compiler": "npm:@angular/compiler@2.0.0-rc.2",
		"@angular/core": "npm:@angular/core@2.0.0-rc.2",
		"@angular/http": "npm:@angular/http@2.0.0-rc.2",
		"@angular/platform-browser": "npm:@angular/platform-browser@2.0.0-rc.2",
		"@angular/platform-browser-dynamic": "npm:@angular/platform-browser-dynamic@2.0.0-rc.2",
		"@angular/router": "npm:@angular/router@3.0.0-alpha.7",
		"core-js": "npm:core-js@2.4.0",
		"fs": "github:jspm/nodelibs-fs@0.2.0-alpha",
		"os": "github:jspm/nodelibs-os@0.2.0-alpha",
		"path": "github:jspm/nodelibs-path@0.2.0-alpha",
		"process": "github:jspm/nodelibs-process@0.2.0-alpha",
		"reflect-metadata": "npm:reflect-metadata@0.1.3",
		"rxjs": "npm:rxjs@5.0.0-beta.6",
		"zone.js": "npm:zone.js@0.6.12"
	},
	packages: {
		"github:jspm/nodelibs-os@0.2.0-alpha": {
			"map": {
				"os-browserify": "npm:os-browserify@0.2.1"
			}
		}
	}
});
