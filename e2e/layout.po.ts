import {browser, by, element} from 'protractor';

export class LayoutPage {
	navigation = {
		home: element(by.css('.home-route'))
	};
	navigateTo(): any {
		return browser.get('/');
	}
}
