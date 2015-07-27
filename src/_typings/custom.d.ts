interface ObjectConstructor {
	assign(target: any, ...sources: any[]): any
}


/**
 * Angular 2
 */

interface List<T> extends Array<T> {}
interface StringMap<K,V> extends Map<K,V> {}
interface Type extends Function {
	new (...args:any[]):any;
}

declare module 'angular2/di' {
	class Injector {}
	class Binding {}
	var Injectable;
	var Inject: any;
	var InjectPromise: any;
}

declare module 'angular2/render' {
	class NativeShadowDomStrategy {
		constructor(styleUrlResolver: any)
	}
	interface EventDispatcher {
		dispatchEvent(elementIndex: number, eventName: string, locals: Map<string, any>): any;
	}
	class RenderViewRef {}
	class RenderProtoViewRef {}
	class ShadowDomStrategy {}
	class Renderer {
		attachComponentView(hostViewRef: RenderViewRef, elementIndex: number, componentViewRef: RenderViewRef): any;
		attachViewInContainer(parentViewRef: RenderViewRef, boundElementIndex: number, atIndex: number, viewRef: RenderViewRef): any;
		callAction(viewRef: RenderViewRef, elementIndex: number, actionExpression: string, actionArgs: any): any;
		createRootHostView(hostProtoViewRef: RenderProtoViewRef, hostElementSelector: string): RenderViewRef;
		createView(protoViewRef: RenderProtoViewRef): RenderViewRef;
		dehydrateView(viewRef: RenderViewRef): any;
		destroyView(viewRef: RenderViewRef): any;
		detachComponentView(hostViewRef: RenderViewRef, boundElementIndex: number, componentViewRef: RenderViewRef): any;
		detachFreeView(view: RenderViewRef): any;
		detachViewInContainer(parentViewRef: RenderViewRef, boundElementIndex: number, atIndex: number, viewRef: RenderViewRef): any;
		hydrateView(viewRef: RenderViewRef): any;
		setElementProperty(viewRef: RenderViewRef, elementIndex: number, propertyName: string, propertyValue: any): any;	
		setEventDispatcher(viewRef: RenderViewRef, dispatcher: EventDispatcher): any;
		setText(viewRef: RenderViewRef, textNodeIndex: number, text: string): any;
	}
}

declare module 'angular2/core' {
	import { Injector } from 'angular2/di';
	import { RenderViewRef } from 'angular2/render';
	class DynamicComponentLoader {}
	class ViewRef {
		render: RenderViewRef;
	}
	class ProtoViewRef {}
	class ViewContainerRef {
		create(protoViewRef?: ProtoViewRef, atIndex?: number, context?: ElementRef, injector?: Injector): ViewRef;
		element: ElementRef;
	}
	class ElementRef {
    	boundElementIndex: number;
    	nativeElement: any;
    	getAttribute(name: string): string;
    	parentView: ViewRef;
  	}
	class BaseQueryList<T> {
		add(obj: any): any;
		fireCallbacks(): any;
		onChange(callback: any): any;
		removeCallback(callback: any): any;
		reset(newList: any): any;
	}
	class QueryList<T> extends  BaseQueryList<T> {
		onChange(callback: any): any;
		removeCallback(callback: any): any;
	}
}

declare module 'angular2/src/facade/async' {
	class Observable {
		observer(generator: any): Object
	}
	class ObservableWrapper {
		static subscribe(emitter: Observable, onNext: Function, onThrow?: Function, onReturn?: Function): Object;
		static dispose(subscription: any): void;
		static callNext(emitter: EventEmitter, value: any): void;
		static callThrow(emitter: EventEmitter, error: any): void;
	}
	class EventEmitter extends  Observable {
		next(value: any): any;
		observer(generator: any): any;
		return(value: any): any;
		throw(error: any): any;
		toRx(): Rx.Observable<any>;
	}
}

declare module 'angular2/src/facade/browser' {
	var document: any;
	const KeyboardEvent;
}

declare module 'angular2/src/facade/lang' {
	class BaseException {
		constructor(message: string);
	}
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

declare module 'angular2/annotations' {
	var Attribute: any;
	var Parent: any;
	var Query: any;
	const onDestroy;
	function Directive(arg: any): (target: any) => any;
	function Component(arg: any): (target: any) => any;
	function View(arg: any): (target: any) => any;
}

declare module "angular2/change_detection" {
	class ChangeDetectorRef {
		requestCheck(): void;
		detach(): void;
		reattach(): void;
	}
	interface Pipe {
		supports(obj): boolean;
		onDestroy(): void;
		transform(value: any): any;
	}
	interface PipeFactory {
		supports(obs): boolean;
		create(cdRef: ChangeDetectorRef): Pipe;
	}
	class NullPipeFactory implements PipeFactory {
		supports(obj): boolean;
		create(cdRef): Pipe;
	}
	class Pipes {
		constructor(config: StringMap<string, PipeFactory[]>);
		static extend(config): any;
	}
	class BasePipe implements Pipe {
		supports(obj): boolean;
		onDestroy(): void;
		transform(value: any): any;
	}
	class JitChangeDetection {}
	class ChangeDetection {}
	class DynamicChangeDetection {}
}

declare module "angular2/directives" {
	class NgFor {}
	class NgIf {}
}

declare module "angular2/forms" {
	class CheckboxControlValueAccessor {}
	interface ControlValueAccessor {
		registerOnChange(fn: any): void;
		registerOnTouched(fn: any): void;
		writeValue(obj: any): void;
	}
	class DefaultValueAccessor {}
	
	class NgControl {
		valueAccessor: ControlValueAccessor;
		control: Control;
	}
	class NgControlGroup {}
	class NgControlName {}
	class NgForm {}
	class NgFormControl {}
	class NgFormModel {}
	class NgModel {}
	class NgRequiredValidator {}
	class FormBuilder {
		group(controls: any): any
		controls: any;
	}
	class AbstractControl {
		dirty: boolean;
		touched: boolean;
		untouched: boolean;
		valueChanges: any;
		valid: boolean;
		pristine: boolean;
	}
	class Control extends AbstractControl {
		constructor(controls: any);
		updateValue(value: any);
	}
	class ControlGroup {
		constructor(controls: any)
		controls: any;
		valueChanges: any;
	}
	class Validators {
		static required: any;
	}
	const formInjectables: any;
	const formDirectives: any;
}

declare module 'angular2/src/http/static_response' {
	class Response {
		headers: any;
		text(): string;
	}
}

declare module 'angular2/http' {
	class Http {}
	const httpInjectables: any;
}

declare module 'angular2/router' {
	interface OnActivate {
		onActivate(nextInstruction: Instruction, prevInstruction: Instruction): any;
	}
	interface OnReuse {
		onReuse(nextInstruction: Instruction, prevInstruction: Instruction): any;
	}
	interface OnDeactivate {
		onDeactivate(nextInstruction: Instruction, prevInstruction: Instruction): any;
	}
	interface CanReuse {
		canReuse(nextInstruction: Instruction, prevInstruction: Instruction): any;
	}
	interface CanDeactivate {
		canDeactivate(nextInstruction: Instruction, prevInstruction: Instruction): any;
	}
	class Instruction {}
	class Router {
		navigate(url: string): Promise<any>
		config(config: any): Promise<any>
		subscribe(onNext: Function): Promise<any>
	}
	class LocationStrategy {}
	class HashLocationStrategy {}
	class Location {
		path(): string;
	}
	var RouterOutlet: any;
	var RouterLink: any;
	var routerInjectables: any;
	var RouteConfig: any;
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
	import { ElementRef } from 'angular2/core';
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

declare module 'angular2/src/core/compiler/dynamic_component_loader' {
	import { ViewRef, ElementRef } from 'angular2/core';
	export class ComponentRef {
		hostView: ViewRef;
		constructor(location: ElementRef, instance: any, dispose: Function);
	}
}

declare module 'angular2/src/core/annotations_impl/view' {
	class View {}
}

declare module 'angular2/test_lib' {
	import { Binding, Injector } from 'angular2/di';
	import { View } from 'angular2/src/core/annotations_impl/view';
	import { DebugElement } from 'angular2/src/debug/debug_element';
	import { ComponentRef } from 'angular2/src/core/compiler/dynamic_component_loader';
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
	function afterEach ();
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
		constructor(type);
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
	}
}