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
	function createTestInjector(bindings: List<ng.Type | ng.Binding | List<any>>): ng.Injector;
	function inject(tokens: List<any>, fn: Function): FunctionWithParamTokens;
	class FunctionWithParamTokens {
		constructor(tokens: List<any>, fn: Function);
		execute(injector: ng.Injector): any;
	}
	class RootTestComponent extends ng.DebugElement {
		constructor(componentRef: ng.ComponentRef);
		detectChanges(): void;
		destroy(): void;
	}
	class TestComponentBuilder {
		constructor(injector: ng.Injector);
		overrideTemplate(componentType: ng.Type, template: string): TestComponentBuilder;
		createAsync(rootComponentType: ng.Type): Promise<RootTestComponent>;
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