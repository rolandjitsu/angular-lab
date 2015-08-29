// TODO: to be removed as soon as angular team exposes these on some public namespace

export function isJsObject (obj: any): boolean {
	return obj !== null && (typeof obj === 'function' || typeof obj === 'object');
}

export function isPresent (obj: any): boolean {
	return obj !== undefined && obj !== null;
}

export function isBlank (obj: any): boolean {
	return obj === undefined || obj === null;
}

export function isString (obj: any): boolean {
	return typeof obj === "string";
}

export function isFunction (obj: any): boolean {
	return typeof obj === 'function';
}

export function isObservable (obs: any): boolean {
	return obs instanceof Observable;
}