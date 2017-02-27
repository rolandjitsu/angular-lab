import {browser, by, element} from 'protractor';

export class LayoutPage {
	navigation = {
		home: element(by.css('.home-route')),
		exchangeRates: element(by.css('.finance-er-route'))
	};
	navigateTo(): any {
		return browser.get('/');
	}
}
