import {environment} from './environments/environment';

export function isStaging(): boolean {
	return environment.staging;
}

export function isProd(): boolean {
	return environment.production;
}
