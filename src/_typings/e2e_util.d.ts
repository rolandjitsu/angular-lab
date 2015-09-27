declare module ngE2eUtil {
	function verifyNoBrowserErrors ();
}

declare module "angular2/src/test_lib/e2e_util" {
	export = ngE2eUtil;
}