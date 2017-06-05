import {browser} from 'protractor';
import {LayoutPage} from './layout.po';


describe('Layout', () => {
	let layout: LayoutPage;

	beforeEach(() => {
		layout = new LayoutPage();
		layout.navigateTo();
	});

	describe('Navigation', () => {
		it('should have a route that links to /', () => {
			const homeRoute = layout.navigation.home;
			expect(homeRoute.isPresent())
				.toBeTrue();
			homeRoute.click();
			expect(browser.getCurrentUrl())
				.toEndWith('/');
		});
	});
});
