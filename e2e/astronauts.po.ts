import {browser, by, element} from 'protractor';

export class AstronautsPage {
	list = element(by.deepCss('rj-astronauts'))
		.all(by.deepCss('[md-list-item]'))
		.$$('[md-line]');
	navigateTo(): any {
		return browser.get('/#/iss/astronauts');
	}
}
