/**
 * Angular 2
 */

declare module 'angular2/render' {
	class NativeShadowDomStrategy {
		constructor(styleUrlResolver: any)
	}
	class ShadowDomStrategy {}
}

declare module 'angular2/src/facade/async' {
	class Observable {
		observer(generator: any): Object
	}
	class ObservableWrapper {
		static subscribe(emitter: Observable, onNext?: Function, onThrow?: Function, onReturn?: Function): Object
		static dispose(subscription: any): void
	}
}

declare module 'angular2/src/facade/browser' {
	var document: any;
}

declare module 'angular2/src/facade/lang' {
	class FunctionWrapper {
		static apply(fn: Function, posArgs?: Array<any>): any
	}
	export class StringWrapper {
		static toLowerCase(s: string): string
	}
	function isJsObject(obj: any): boolean;
	function isFunction(obj: any): boolean;
	function isString(obj: any): boolean;
}

declare module 'angular2/src/router/browser_location' {
	class BrowserLocation {
		path(): string
	}
}

declare module "angular2/change_detection" {
	class Pipe {}
	class PipeFactory {}
	class NullPipeFactory extends PipeFactory {}
	class PipeRegistry {
		constructor(pipes: any)
	}
	class JitChangeDetection {}
	class ChangeDetection {}
	class DynamicChangeDetection {}
	var defaultPipes: any;
}

declare module "angular2/forms" {
	class DefaultValueAccessor {}
	class CheckboxControlValueAccessor {}
	class FormModelDirective {}
	class FormControlDirective {}
	class FormBuilder {
		group(controls: any): any
	}
	class Control {
		constructor(controls: any)
		updateValue(value: any)
		valueChanges: any;
		valid: boolean;
	}
	class ControlGroup {
		constructor(controls: any)
		controls: any;
		valueChanges: any;
	}
	class Validators {
		static required: any;
	}
}

declare module 'angular2/router' {
	class Instruction {}
	class Router {
		navigate(url: string): Promise<any>
		config(config: any): Promise<any>
	}
	var RouterOutlet: any;
	var RouterLink: any;
	var routerInjectables: any;
	var RouteConfig: any;
}


/**
 * ES6
 * 
 * Sources:
 * - [maps]{@link https://github.com/Microsoft/TypeScript/issues/3290}
 */
 
interface Map<K, V> {
    clear(): void;
    delete(key: K): boolean;
    forEach(callbackfn: (value: V, index: K, map: Map<K, V>) => void, thisArg?: any): void;
    get(key: K): V;
    has(key: K): boolean;
    set(key: K, value: V): Map<K, V>;
    size: number;
}

declare var Map: {
    new <K, V>(...items: Array<any>): Map<K, V>;
    prototype: Map<any, any>;
}
 
interface ObjectConstructor {
	assign(target: any, ...sources: any[]): any
}

interface ArrayConstructor {
	from(...sources: any[]): any
}