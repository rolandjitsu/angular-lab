import {browser} from 'protractor';
import {LayoutPage} from './layout.po';


describe('Layout', () => {
	let layout: LayoutPage;

	beforeAll(() => {
		browser.waitForAngularEnabled(false);
	});
	afterAll(() => {
		browser.waitForAngularEnabled(true);
	});
	beforeEach(() => {
		layout = new LayoutPage();
		layout.navigateTo();
	});

	describe('Navigation', () => {
		it('should have a route that links to /iss/astronauts', () => {
			const astronautsRoute = layout.navigation.astronauts;
			expect(astronautsRoute.isPresent())
				.toBeTrue();
			astronautsRoute.click();
			expect(browser.getCurrentUrl())
				.toEndWith('/iss/astronauts');
		});

		it('should have a route that links to /iss/location', () => {
			const locationRoute = layout.navigation.location;
			expect(locationRoute.isPresent())
				.toBeTrue();
			locationRoute.click();
			expect(browser.getCurrentUrl())
				.toEndWith('/iss/location');
		});

		it('should have a route that links to /', () => {
			const homeRoute = layout.navigation.home;
			expect(homeRoute.isPresent())
				.toBeTrue();
			homeRoute.click();
			expect(browser.getCurrentUrl())
				.toEndWith('#/');
		});
	});
});
