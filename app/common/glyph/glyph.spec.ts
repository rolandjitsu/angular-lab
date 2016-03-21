import {
	ComponentFixture,
	TestComponentBuilder,
	afterEach,
	beforeEachProviders,
	// https://github.com/angular/angular/commit/c1a0af5
	withProviders,
	beforeEach,
	describe,
	expect,
	inject,
	it
} from 'angular2/testing';
import {By} from 'angular2/platform/browser';
import {
	provide,
	EventEmitter,
	Component
} from 'angular2/core';
import {MockBackend, MockConnection} from 'angular2/http/testing';
import {
	ConnectionBackend,
	BaseRequestOptions,
	ResponseOptions,
	Response,
	Http
} from 'angular2/http';
import {Scheduler} from 'rxjs/Rx';

import {Icon} from '../../services';
import {Glyph} from './glyph';

const GLYPH_RESPONSE_BODY = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24"><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/></svg>';

describe('<glyph>', () => {
	let backend: MockBackend;
	let response;
	let builder;

	beforeEachProviders(() => [
		BaseRequestOptions,
		MockBackend,
		provide(Http, {
			useFactory: (connectionBackend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
				return new Http(connectionBackend, defaultOptions);
			},
			deps: [
				MockBackend,
				BaseRequestOptions
			]
		}),
		provide(Icon, {
			useFactory: (http: Http) => {
				return new Icon(http);
			},
			deps: [
				Http
			]
		})
	]);

	beforeEach(inject([MockBackend, TestComponentBuilder], (mockBackend, tcb: TestComponentBuilder) => {
		response = new Response(
			new ResponseOptions({body: GLYPH_RESPONSE_BODY})
		);
		backend = mockBackend;
		builder = tcb;
	}));

	afterEach(() => backend.verifyNoPendingRequests());

	it('should append an svg as child of self', (done: () => void) => {
		backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(response));
		return builder
			.createAsync(GlyphTest)
			.then((fixture: ComponentFixture) => {
				fixture.detectChanges();
				// Make sure the element has been appended to DOM
				Scheduler.queue.schedule(() => {
					const svg = fixture.debugElement.query(By.css('glyph'));
					expect((<HTMLCollection>svg.nativeNode.children).length).toEqual(1);
					done();
				}, 50);
			});
	});
});


@Component({
	selector: 'glyph-test',
	template: `<glyph src="glyph.svg"></glyph>`,
	directives: [
		Glyph
	]
})
class GlyphTest {}
