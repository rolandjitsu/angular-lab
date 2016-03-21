// import {verifyNoBrowserErrors} from 'angular2/src/testing/e2e_util';

describe('auth', () => {
	// afterEach(verifyNoBrowserErrors);

	it('should redirect the user to the /login page if not authenticated', () => {
		const URL = '/';
		browser.get(URL);

	});

});
