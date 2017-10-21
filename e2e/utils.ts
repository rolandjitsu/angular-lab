import {browser} from 'protractor';

export async function getCurrentUrl(): Promise<string> {
    const url = await browser.getCurrentUrl();
    return url;
}
