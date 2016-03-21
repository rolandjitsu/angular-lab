export function isBlank (obj: any): boolean {
	return obj === undefined || obj === null;
}

export function isFunction (obj: any): boolean {
	return typeof obj === 'function';
}

export function isPresent (obj: any): boolean {
	return obj !== undefined && obj !== null;
}