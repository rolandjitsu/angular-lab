import {browser} from 'protractor';
import {LayoutPage} from './layout.po';


describe('Layout', () => {
	let layout: LayoutPage;

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
			browser.waitForAngularEnabled(false);
			locationRoute.click();
			browser.sleep(15000);
			expect(browser.getCurrentUrl())
				.toEndWith('/iss/location');
			browser.waitForAngularEnabled(true);
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
