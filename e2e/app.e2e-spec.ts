import {browser} from 'protractor';

describe('Angular Lab', () => {
    it('should pass sanity check', () => {
        browser.get('/');
        expect(browser.getCurrentUrl())
            .toEndWith('/');
    });
});
