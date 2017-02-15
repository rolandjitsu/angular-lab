import {browser} from 'protractor';

export class HomePage {
	navigateTo(): any {
		return browser.get('/');
	}
}
