describe('auth', () => {
	// browser.pause();
	// browser.get('/');
	
	it('should redirect the user to the /login page if not authenticated', () => {
		const URL = '/';
		browser.get(URL);
		waitForElement('.login-form');
		expect(element.all(by.css('.login-form')).count()).toEqual(1);
	});
	
});

function waitForElement (selector) {
	const EC = (<any>protractor).ExpectedConditions;
	// Waits for the element with id 'abc' to be present on the dom.
	browser.wait(EC.presenceOf($(selector)), 20000);
}