declare module ngE2eUtil {
	function verifyNoBrowserErrors ();
}

declare module "angular2/src/testing/e2e_util" {
	export = ngE2eUtil;
}