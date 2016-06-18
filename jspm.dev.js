SystemJS.config({
	map: {
		"plugin-typescript": "github:frankwallis/plugin-typescript@4.0.16",
		"plugin-babel": "npm:systemjs-plugin-babel@0.0.12"
	},
	packages: {
		"github:frankwallis/plugin-typescript@4.0.16": {
			"map": {
				"typescript": "npm:typescript@1.8.10"
			}
		}
	}
});
