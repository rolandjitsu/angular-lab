import {browser} from 'protractor';
import {LayoutPage} from './layout.po';


describe('Layout', () => {
	let layout: LayoutPage;

	beforeEach(() => {
		layout = new LayoutPage();
		layout.navigateTo();
	});

	describe('Navigation', () => {
		it('should have a route that links to /finance/exchange-rates', () => {
			const exchangeRatesRoute = layout.navigation.exchangeRates;
			expect(exchangeRatesRoute.isPresent())
				.toBeTrue();
			exchangeRatesRoute.click();
			expect(browser.getCurrentUrl())
				.toEndWith('/finance/exchange-rates');
		});
	});
});
