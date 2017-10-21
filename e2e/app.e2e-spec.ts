import {browser} from 'protractor';
import {getCurrentUrl} from './utils';

describe('Angular Lab', () => {
    it('should pass sanity check', async () => {
        await browser.get('/');
        const url = await getCurrentUrl();
        expect(url).toEndWith('/');
    });
});
