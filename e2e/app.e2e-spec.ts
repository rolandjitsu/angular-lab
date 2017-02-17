import {browser} from 'protractor';
import {HomePage} from './home.po';


describe('Angular Lab', () => {
	let homePage: HomePage;

	beforeEach(() => {
		homePage = new HomePage();
	});

	describe('Home', () => {
		it('should successfully open the home page', () => {
			homePage.navigateTo();
			expect(browser.getCurrentUrl())
				.toEndWith('/');
		});
	});

	describe('Navigation', () => {
		beforeAll(() => {
			browser.waitForAngularEnabled(false);
		});

		afterAll(() => {
			browser.waitForAngularEnabled(true);
		});

		it('should have a route that links to /iss/astronauts', () => {
			const astronautsRoute = homePage.navigation.astronauts;
			expect(astronautsRoute.isPresent())
				.toBeTrue();
			astronautsRoute.click();
			expect(browser.getCurrentUrl())
				.toEndWith('/iss/astronauts');
		});

		it('should have a route that links to /iss/location', () => {
			const locationRoute = homePage.navigation.location;
			expect(locationRoute.isPresent())
				.toBeTrue();
			locationRoute.click();
			expect(browser.getCurrentUrl())
				.toEndWith('/iss/location');
		});

		it('should have a route that links to /', () => {
			const homeRoute = homePage.navigation.home;
			expect(homeRoute.isPresent())
				.toBeTrue();
			homeRoute.click();
			expect(browser.getCurrentUrl())
				.toEndWith('#/');
		});
	});
});
