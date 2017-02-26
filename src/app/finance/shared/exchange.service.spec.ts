// tslint:disable:no-magic-numbers
import {TestBed, async, inject} from '@angular/core/testing';
import {MockBackend, MockConnection} from '@angular/http/testing';
import {
	Http,
	ConnectionBackend,
	BaseRequestOptions,
	ResponseOptions,
	Response
} from '@angular/http';

import {openExchangeAppId} from '../../../env';
import {ExchangeService} from './exchange.service';
import {Currencies} from './currencies';
import {Rates, RatesResponse} from './rates';
import {Converter} from './converter';


export function provideHttpFactory(connectionBackend: ConnectionBackend, defaultOptions: BaseRequestOptions): Http {
	return new Http(connectionBackend, defaultOptions);
}

export function provideExchangeServiceFactory(http: Http): ExchangeService {
	return new ExchangeService(http);
}


describe('Angular Lab', () => {
	describe('ExchangeService', () => {
		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [
					{
						provide: ExchangeService,
						useFactory: provideExchangeServiceFactory,
						deps: [
							Http
						]
					},
					{
						provide: Http,
						useFactory: provideHttpFactory,
						deps: [
							MockBackend,
							BaseRequestOptions
						]
					},
					BaseRequestOptions,
					MockBackend
				]
			});
		});

		afterEach(() => inject([MockBackend], (backend: MockBackend) => {
			backend.verifyNoPendingRequests();
		}));

		describe('apiUrlForPath()', () => {
			it('should properly construct an url for querying Open Exchange APIs', () => {
				const url = ExchangeService.apiUrlForPath('/ping');
				expect(url).toEqual(`${ExchangeService.API_ROOT}/ping.json?app_id=${openExchangeAppId}`);
			});

			it('should append query params', () => {
				const url = ExchangeService.apiUrlForPath('/ping', {
					test: true
				});
				expect(url.indexOf('test=true')).not.toEqual(-1);
			});
		});

		describe('currencies()', () => {
			it('should return a multicasted Observable', async(inject([MockBackend, ExchangeService], (backend: MockBackend, exchange: ExchangeService) => {
				let count = 0;
				backend.connections.subscribe((connection: MockConnection) => {
					count++;
					connection.mockRespond(new Response(new ResponseOptions({
						body: {},
						status: 200
					})));
				});

				const currencies = exchange.currencies();

				currencies.subscribe();
				currencies.subscribe();

				expect(count).toEqual(1);
			})));

			it('should return an Observable of Currencies', async(inject([MockBackend, ExchangeService], (backend: MockBackend, exchange: ExchangeService) => {
				backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(new Response(new ResponseOptions({
					body: {},
					status: 200
				}))));

				exchange.currencies()
					.subscribe((currencies) => {
						expect(currencies instanceof Currencies)
							.toBeTruthy();
					});
			})));
		});

		describe('rates()', () => {
			let body: RatesResponse;
			beforeEach(() => {
				body = {
					disclaimer: '',
					license: '',
					timestamp: Date.now(),
					base: 'USD',
					rates: {
						EUR: 0.96
					}
				};
			});

			it('should return a multicasted Observable', async(inject([MockBackend, ExchangeService], (backend: MockBackend, exchange: ExchangeService) => {
				let count = 0;
				backend.connections.subscribe((connection: MockConnection) => {
					count++;
					connection.mockRespond(new Response(new ResponseOptions({
						body,
						status: 200
					})));
				});

				const rates = exchange.rates();

				rates.subscribe();
				rates.subscribe();

				expect(count).toEqual(1);
			})));

			it('should return an Observable of Rates', async(inject([MockBackend, ExchangeService], (backend: MockBackend, exchange: ExchangeService) => {
				backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(new Response(new ResponseOptions({
					body,
					status: 200
				}))));

				exchange.rates()
					.subscribe((rates) => {
						expect(rates instanceof Rates)
							.toBeTruthy();
					});
			})));
		});

		describe('converter()', () => {
			it('should return a Converter', async(inject([MockBackend, ExchangeService], (backend: MockBackend, exchange: ExchangeService) => {
				backend.connections.subscribe((connection: MockConnection) => {
					connection.mockRespond(new Response(new ResponseOptions({
						body: {
							disclaimer: '',
							license: '',
							timestamp: Date.now(),
							base: 'USD',
							rates: {
								EUR: 0.96
							}
						},
						status: 200
					})));
				});

				const converter = exchange.converter();

				expect(converter instanceof Converter)
					.toBeTruthy();
			})));
		});
	});
});
