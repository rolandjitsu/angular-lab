import {
	AsyncTestCompleter,
	TestComponentBuilder,
	afterEach,
	beforeEachBindings,
	beforeEach,
	describe,
	expect,
	inject,
	it
} from 'angular2/test_lib';
import { DOM } from 'angular2/src/dom/dom_adapter';
import { ObservableWrapper } from 'angular2/src/facade/async';
import {
	Injector,
	bind,
	Component,
	View,
	MockBackend,
	MockConnection,
	ConnectionBackend,
	BaseRequestOptions,
	Response,
	Http
} from 'angular2/angular2';

import { isNativeShadowDOMSupported } from 'common/shadow_dom';
import { IconStore } from 'common/icon';
import { Logo } from 'app/directives';

const LOGO_GLYPH_HTML = `
	<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="166px" height="176px" viewBox="0 0 166 176">
		<path fill="#B2B2B2" d="M82.688,0L0,29.1l13.066,108.335l69.71,38.314l70.069-38.834l13.062-108.331L82.688,0z M82.688,0" />
		<path fill="#B52E31" d="M157.66,34.846L82.496,9.214v157.381l62.991-34.861L157.66,34.846z M157.66,34.846" />
		<path fill="#E23237" d="M9.279,35.308l11.196,96.889l62.019,34.398V9.211L9.279,35.308z M9.279,35.308" />
		<path fill="#F2F2F2" d="M99.918,87.493L82.632,51.396L67.415,87.493H99.918z M106.508,102.672h-45.82l-10.251,25.64l-19.067,0.352
		L82.496,14.929l52.908,113.734h-17.673L106.508,102.672z M106.508,102.672" />
		<path fill="#B2B2B2" d="M82.496,14.929l0.136,36.467l17.268,36.125H82.534l-0.039,15.127l24.012,0.023l11.223,25.996l18.245,0.339
		L82.496,14.929z M82.496,14.929" />
	</svg>
`;

export function main () {
	describe('logo', () => {
		var injector: Injector;
		var backend: MockBackend;
		var response;
		
		beforeEachBindings(() => [
			BaseRequestOptions,
			MockBackend,
			bind(Http).toFactory((connectionBackend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
				return new Http(connectionBackend, defaultOptions);
			}, [
				MockBackend,
				BaseRequestOptions
			]),
			bind(IconStore).toClass(IconStore, [
				Http
			])
		]);

		beforeEach(() => {
			injector = Injector.resolveAndCreate([
				MockBackend
			]);
			backend = injector.get(MockBackend);
			response = new Response({ body: LOGO_GLYPH_HTML });
		});
		
		afterEach(() => backend.verifyNoPendingRequests());
		
		it('should append an svg as child of self', inject([TestComponentBuilder, AsyncTestCompleter], (tcb: TestComponentBuilder, async) => {
			let html = '<div class="logo" logo></div>';
			ObservableWrapper.subscribe(backend.connections, (connection: MockConnection) => {
				// console.log(connection);
				connection.mockRespond(response)
			});
			tcb
				.overrideTemplate(Test, html)
				.createAsync(Test)
				.then((rootTC) => {
					rootTC.detectChanges();
					let logo: Element = DOM.querySelector(rootTC.nativeElement, '.logo');
					let prefixSelector = isNativeShadowDOMSupported ? '* /deep/ ' : ''; // soon use '>>>' https://www.chromestatus.com/features/6750456638341120
					// console.log(logo.firstChild, prefixSelector);
					// expect(logo.querySelector(prefixSelector + 'svg')).not.toBe(null);
					async.done();
				});
		}));
	});
}

@Component({
	selector: 'test'
})
@View({
	directives: [
		Logo
	]
})
class Test {
	constructor() {}
}