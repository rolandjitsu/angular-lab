SystemJS.config({
	baseURL: "/",
	trace: false,
	production: false,
	paths: {
		"github:*": "jspm_packages/github/*",
		"npm:*": "jspm_packages/npm/*"
	},
	packages: {
		app: {defaultExtension: 'js'}
	}
});
