import {browser, by, element} from 'protractor';

export class LayoutPage {
    navigation = {
        home: element(by.css('.js-home-route'))
    };
    navigateTo(): any {
        return browser.get('/');
    }
}
