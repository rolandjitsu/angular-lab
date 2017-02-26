import {environment} from './environments/environment';

// Open Exchange Rates app ID.
// https://openexchangerates.org
export const openExchangeAppId = 'b0c0fd810c574768b01ce1c8e1caa346';

export function isProd(): boolean {
	return environment.production;
}
