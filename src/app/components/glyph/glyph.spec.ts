import {
	ComponentFixture,
	TestComponentBuilder,
	afterEach,
	beforeEachProviders,
	beforeEach,
	describe,
	expect,
	inject,
	it
} from 'angular2/testing';
import {
	provide,
	EventEmitter,
	Component
} from 'angular2/core';
import {MockBackend, MockConnection,} from 'angular2/http/testing'
import {
	ConnectionBackend,
	BaseRequestOptions,
	ResponseOptions,
	Response,
	Http
} from 'angular2/http';

import {Icon} from '../../services';
import {Glyph} from './glyph';

const GLYPH_RESPONSE_BODY = `
	<?xml version="1.0" encoding="UTF-8"?>
	<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
	<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24"><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>
`;

export function main() {
	describe('<glyph>', () => {
		let backend: MockBackend;
		let response;

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

		beforeEach(inject([MockBackend], (mockBackend) => {
			backend = mockBackend;
			response = new Response(
				new ResponseOptions({body: GLYPH_RESPONSE_BODY})
			);
		}));

		afterEach(() => backend.verifyNoPendingRequests());

		it('should append an svg as child of self', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
			let ee: any = new EventEmitter();
			backend.connections.subscribe((connection: MockConnection) => {
				connection.mockRespond(response);
				ee.resolve();
			});
			tcb
				.createAsync(GlyphTest)
				.then((fixture: ComponentFixture) => {
					fixture.detectChanges();
					ee.subscribe(null, null, () => {
						let logo: Element = fixture.nativeElement.querySelector('glyph');
						expect(logo.querySelector('svg')).not.toBe(null);
					});
				});
		}));
	});
}


@Component({
	selector: 'glyph-test',
	template: `<glyph src="glyph.svg"></glyph>`,
	directives: [
		Glyph
	]
})

class GlyphTest {}