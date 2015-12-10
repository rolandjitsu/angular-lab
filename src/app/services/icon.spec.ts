import {
	afterEach,
	beforeEach,
	describe,
	expect,
	inject,
	it
} from 'angular2/testing';
import {
	Injector,
	provide
} from 'angular2/core';
import {MockBackend, MockConnection} from 'angular2/http/testing';
import {
	ConnectionBackend,
	BaseRequestOptions,
	ResponseOptions,
	Response,
	Http
} from 'angular2/http';

import {Icon} from './icon';

const SVG_GLYPH_HTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24"><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/></svg>';
const FAKE_URL = 'glyph.svg';

export function main() {
	describe('Icon', () => {
		let injector: Injector;
		let store: Icon;
		let backend: MockBackend;
		let glyph: Node;
		let response;

		beforeEach(() => {
			injector = Injector.resolveAndCreate([
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
			backend = injector.get(MockBackend);
			store = injector.get(Icon);
			response = new Response(
				new ResponseOptions({body: SVG_GLYPH_HTML})
			);
			glyph = createGlyphNode();
		});

		afterEach(() => backend.verifyNoPendingRequests());

		describe('.get', () => {
			it('return value should be an SVG element', inject([], () => {
				backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(response));
				store.get(FAKE_URL).then((svg) => {
					expect(svg.isEqualNode(glyph)).toBe(true);
				});
			}));
			it('should only fire one request for the same path and resolve from cache', inject([], () => {
				let url = `ofor/${FAKE_URL}`;
				let spy = jasmine.createSpy('onEstablish');
				let bc = {
					onEstablish: spy
				};
				backend.connections.subscribe((connection: MockConnection) => {
					bc.onEstablish();
					connection.mockRespond(response);
				});
				store.get(url).then(() => {
					store.get(url).then(() => {
						expect(bc.onEstablish.calls.count()).toEqual(1);
					});
				});
			}));
		});
	});
}

function createGlyphNode(): Node {
	let container = document.createElement('div');
	container.innerHTML = SVG_GLYPH_HTML;
	return container.firstChild.cloneNode(true);
}