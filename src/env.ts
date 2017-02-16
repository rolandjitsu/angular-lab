import {environment} from './environments/environment';

// Mapbox GL Access Token
export const mapboxAccessToken = 'pk.eyJ1Ijoicm9sYW5kaml0c3UiLCJhIjoiY2l6N3piaDMxMDAwdTJ4bWRhbHR3eTJtYyJ9.F7mgBOWcFf842IuLcJ8nUw';


export function isStaging(): boolean {
	return environment.staging;
}

export function isProd(): boolean {
	return environment.production;
}
