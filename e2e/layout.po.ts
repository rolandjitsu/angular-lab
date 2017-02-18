import {browser, by, element} from 'protractor';

export class LayoutPage {
	navigation = {
		home: element(by.deepCss('.home-route')),
		astronauts: element(by.deepCss('.iss-astronauts-route')),
		location: element(by.deepCss('.iss-location-route'))
	};
	navigateTo(): any {
		return browser.get('/');
	}
}
