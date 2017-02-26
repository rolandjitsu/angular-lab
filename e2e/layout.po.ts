import {browser, by, element} from 'protractor';

export class LayoutPage {
	navigation = {
		home: element(by.deepCss('.home-route')),
		exchangeRates: element(by.deepCss('.finance-er-route'))
	};
	navigateTo(): any {
		return browser.get('/');
	}
}
