import {browser} from 'protractor';
import {HomePage} from './home.po';


describe('Angular Lab', () => {
	let page: HomePage;

	beforeEach(() => {
		page = new HomePage();
	});

	describe('Home', () => {
		it('should successfully open the home page', () => {
			page.navigateTo();
			expect(browser.getCurrentUrl())
				.toEndWith('/');
		});
	});
});
