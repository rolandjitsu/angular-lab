declare module ngTestLib {
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

declare module "angular2/test_lib" {
	export = ngTestLib;
}