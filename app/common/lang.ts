export function isBlank (obj: any): boolean {
	return obj === undefined || obj === null;
}

export function isFunction (obj: any): boolean {
	return typeof obj === 'function';
}

export function isJsObject (obj: any) {
	return obj !== null && (typeof obj === 'function' || typeof obj === 'object');
}

export function isPresent (obj: any): boolean {
	return obj !== undefined && obj !== null;
}
