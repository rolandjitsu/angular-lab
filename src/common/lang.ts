export function isBlank (obj: any): boolean {
	return obj === undefined || obj === null;
}

export function isFunction (obj: any): boolean {
	return typeof obj === 'function';
}

export const isNativeShadowDomSupported: boolean = Boolean(document && document.body && document.body.createShadowRoot); // See Shadow DOM support: http://caniuse.com/#feat=shadowdom

export function isNumber (obj: any): boolean {
	return typeof obj === 'number';
}

export function isObject (obj: any): boolean {
	return obj !== null && (typeof obj === 'function' || typeof obj === 'object');
}

export function isPresent (obj: any): boolean {
	return obj !== undefined && obj !== null;
}

export function isString (obj: any): boolean {
	return typeof obj === 'string';
}