interface ObjectConstructor {
	assign(target: any, ...sources: any[]): any
}

declare module ng {}

declare module 'angular2/src/facade/async' {
	import { EventEmitter, Observable } from 'angular2/angular2';
	class ObservableWrapper {
		static subscribe(emitter: Observable, onNext: Function, onThrow?: Function, onReturn?: Function): Object;
		static dispose(subscription: any): void;
		static callNext(emitter: EventEmitter, value: any): void;
		static callThrow(emitter: EventEmitter, error: any): void;
		static callReturn(emitter: EventEmitter): void;
		static isObservable(obs: any): boolean;
	}
}

declare module 'angular2/src/facade/browser' {
	var document: any;
	const KeyboardEvent;
}

declare module 'angular2/src/facade/lang' {
	class FunctionWrapper {
		static apply(fn: Function, posArgs?: Array<any>): any
	}
	class StringWrapper {
		static toLowerCase(s: string): string
	}
	class NumberWrapper {
		static parseInt(text: string, radix: number): number;
		static isNaN(value: any): boolean;
	}
	function isBlank (obj: any): boolean;
	function isJsObject(obj: any): boolean;
	function isPresent(obj: any): boolean;
	function isFunction(obj: any): boolean;
	function isString(obj: any): boolean;
}

declare module 'angular2/src/http/static_response' {
	class Response {
		headers: any;
		text(): string;
	}
}

declare module 'angular2/src/facade/collection' {
	interface Predicate<T> {
		(value: T, index?: number, array?: T[]): boolean;
	}
}

declare module 'angular2/src/core/compiler/view' {
	class AppView {}
}

declare module 'angular2/src/debug/debug_element' {
	import { ElementRef, Type } from 'angular2/angular2';
	import { Predicate } from 'angular2/src/facade/collection';
	import { AppView } from 'angular2/src/core/compiler/view';
	class DebugElement {
		componentInstance: any;
		nativeElement: any;
		elementRef: ElementRef;
		children: List<DebugElement>;
		componentViewChildren: List<DebugElement>;
		constructor(_parentView: AppView, _boundElementIndex: number);
		static create(elementRef: ElementRef): DebugElement;
		getDirectiveInstance(directiveIndex: number): any;
		triggerEventHandler(eventName: string, eventObj: Event): void;
		hasDirective(type: Type): boolean;
		inject(type: Type): any;
		getLocal(name: string): any;
		query(predicate: Predicate<DebugElement>, scope: Function): DebugElement;
		queryAll(predicate: Predicate<DebugElement>, scope: Function): List<DebugElement>;
	}
	function inspectElement(elementRef: ElementRef): DebugElement;
	function asNativeElements(arr: List<DebugElement>): List<any>;
	class Scope {
		static all(debugElement: DebugElement): List<DebugElement>;
		static light(debugElement: DebugElement): List<DebugElement>;
		static view(debugElement: DebugElement): List<DebugElement>;
	}
	export class By {
		static all(): Function;	
		static css(selector: string): Predicate<DebugElement>;
		static directive(type: Type): Predicate<DebugElement>;
	}
}

declare module 'angular2/test_lib' {
	import { Binding, Injector, View, ComponentRef, Type } from 'angular2/angular2';
	import { DebugElement } from 'angular2/src/debug/debug_element';
	interface NgMatchers extends jasmine.Matchers {
		toBe(expected: any): boolean;
		toEqual(expected: any): boolean;
		toBePromise(): boolean;
		toBeAnInstanceOf(expected: any): boolean;
		toHaveText(expected: any): boolean;
		toImplement(expected: any): boolean;
		not: NgMatchers;
	}
	var expect: (actual: any) => NgMatchers;
	class AsyncTestCompleter {
		constructor(done: Function);
		done();
	}
	function describe (...args);
	function ddescribe (...args);
	function xdescribe (...args);
	function beforeEach (fn);
	function afterEach (fn);
	function beforeEachBindings (fn);
	function it (name, fn);
	function xit (name, fn);
	function iit (name, fn);
	interface GuinessCompatibleSpy extends jasmine.Spy {
		andReturn(val: any): void;
		andCallFake(fn: Function): GuinessCompatibleSpy;
		reset();
	}
	class SpyObject {
		noSuchMethod(args);
		spy(name);
		static stub (object, config, overrides);
		rttsAssert(value);
	}
	function isInInnerZone (): boolean;
	function createTestInjector(bindings: List<Type | Binding | List<any>>): Injector;
	function inject(tokens: List<any>, fn: Function): FunctionWithParamTokens;
	class FunctionWithParamTokens {
		constructor(tokens: List<any>, fn: Function);
		execute(injector: Injector): any;
	}
	class RootTestComponent extends DebugElement {
		constructor(componentRef: ComponentRef);
		detectChanges(): void;
		destroy(): void;
	}
	class TestComponentBuilder {
		constructor(injector: Injector);
		overrideTemplate(componentType: Type, template: string): TestComponentBuilder;
		overrideView(componentType: Type, view: View): TestComponentBuilder;
		overrideDirective(componentType: Type, from: Type, to: Type): TestComponentBuilder;
		createAsync(rootComponentType: Type): Promise<RootTestComponent>;
	}
	class SpyChangeDetector extends SpyObject {}
	class SpyProtoChangeDetector extends SpyObject {}
	class SpyPipe extends SpyObject {}
	class SpyPipeFactory extends SpyObject {}
	class SpyDependencyProvider extends SpyObject {}
}

declare module 'angular2/src/dom/dom_adapter' {
	var DOM: DomAdapter;
	class DomAdapter {
		querySelector(el, selector: string): HTMLElement;
		querySelectorAll(el, selector: string): List<any>;
		createElement(tagName, doc?): HTMLElement;
	}
}