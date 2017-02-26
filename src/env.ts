import {environment} from './environments/environment';

// Mapbox GL Access Token
export const mapboxAccessToken = 'pk.eyJ1Ijoicm9sYW5kaml0c3UiLCJhIjoiY2l6N3piaDMxMDAwdTJ4bWRhbHR3eTJtYyJ9.F7mgBOWcFf842IuLcJ8nUw';

export const openExchangeAppId = 'b0c0fd810c574768b01ce1c8e1caa346';

export function isProd(): boolean {
	return environment.production;
}
