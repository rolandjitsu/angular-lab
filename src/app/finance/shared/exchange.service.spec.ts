// tslint:disable:no-magic-numbers
import {TestBed, async, inject} from '@angular/core/testing';
import {MockBackend, MockConnection} from '@angular/http/testing';
import {LOCALE_ID} from '@angular/core';
import {
	Http,
	ConnectionBackend,
	BaseRequestOptions,
	ResponseOptions,
	Response
} from '@angular/http';

import {openExchangeAppId} from '../../../env';
import {OpenExchangeService} from './exchange.service';
import {Currencies, Currency} from './currencies';
import {Rates, RatesResponse} from './rates';
import {RateSeries} from './series';


export function provideHttpFactory(connectionBackend: ConnectionBackend, defaultOptions: BaseRequestOptions): Http {
	return new Http(connectionBackend, defaultOptions);
}

export function provideExchangeServiceFactory(http: Http, locale: string): OpenExchangeService {
	return new OpenExchangeService(http, locale);
}


describe('Angular Lab', () => {
	describe('OpenExchangeService', () => {
		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [
					{
						provide: OpenExchangeService,
						useFactory: provideExchangeServiceFactory,
						deps: [
							Http,
							LOCALE_ID
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
					MockBackend,
					{
						provide: LOCALE_ID,
						useValue: 'en-US'
					}
				]
			});
		});

		afterEach(() => inject([MockBackend], (backend: MockBackend) => {
			backend.verifyNoPendingRequests();
		}));

		describe('apiUrlForPath()', () => {
			it('should properly construct an url for querying Open Exchange APIs', () => {
				const url = OpenExchangeService.apiUrlForPath('/ping');
				expect(url).toEqual(`${OpenExchangeService.API_ROOT}/ping.json?app_id=${openExchangeAppId}`);
			});

			it('should append query params', () => {
				const url = OpenExchangeService.apiUrlForPath('/ping', {
					test: true
				});
				expect(url.indexOf('test=true')).not.toEqual(-1);
			});
		});

		describe('toOpenExchangeDateFormat()', () => {
			it('should convert a Date to the format required by Open Exchange APIs', inject([OpenExchangeService], (openExchange: OpenExchangeService) => {
				const date = new Date(1488195827019);
				expect(openExchange.toOpenExchangeDateFormat(date))
					.toEqual('2017-02-27');
			}));
		});

		describe('currencies()', () => {
			it('should return a multicasted Observable', async(inject([MockBackend, OpenExchangeService], (backend: MockBackend, openExchange: OpenExchangeService) => {
				let count = 0;
				backend.connections.subscribe((connection: MockConnection) => {
					count++;
					connection.mockRespond(new Response(new ResponseOptions({
						body: {},
						status: 200
					})));
				});

				const currencies = openExchange.currencies();

				currencies.subscribe();
				currencies.subscribe();

				expect(count).toEqual(1);
			})));

			it('should return an Observable of Currencies', async(inject([MockBackend, OpenExchangeService], (backend: MockBackend, openExchange: OpenExchangeService) => {
				backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(new Response(new ResponseOptions({
					body: {},
					status: 200
				}))));

				openExchange.currencies()
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

			it('should return a multicasted Observable', async(inject([MockBackend, OpenExchangeService], (backend: MockBackend, openExchange: OpenExchangeService) => {
				let count = 0;
				backend.connections.subscribe((connection: MockConnection) => {
					count++;
					connection.mockRespond(new Response(new ResponseOptions({
						body,
						status: 200
					})));
				});

				const rates = openExchange.rates();

				rates.subscribe();
				rates.subscribe();

				expect(count).toEqual(1);
			})));

			it('should return an Observable of Rates', async(inject([MockBackend, OpenExchangeService], (backend: MockBackend, openExchange: OpenExchangeService) => {
				backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(new Response(new ResponseOptions({
					body,
					status: 200
				}))));

				openExchange.rates()
					.subscribe((rates) => {
						expect(rates instanceof Rates)
							.toBeTruthy();
					});
			})));
		});

		describe('series()', () => {
			const startDate = '2013-01-01';
			const endDate = '2013-01-03';
			const euro = new Currency('EUR', 'Euro');
			let body;

			beforeEach(() => {
				body = {
					disclaimer: '',
					license: '',
					start_date: startDate,
					end_date: endDate,
					base: 'USD',
					rates: {
						'2013-01-01': {
							EUR: 0.5
						},
						'2013-01-02': {
							EUR: 0.65
						},
						'2013-01-03': {
							EUR: 0.60
						}
					}
				};
			});

			it('should return a multicasted Observable', async(inject([MockBackend, OpenExchangeService], (backend: MockBackend, openExchange: OpenExchangeService) => {
				let count = 0;
				backend.connections.subscribe((connection: MockConnection) => {
					count++;
					connection.mockRespond(new Response(new ResponseOptions({
						body,
						status: 200
					})));
				});

				const series = openExchange.series(new Date(startDate), new Date(endDate), [euro]);

				series.subscribe();
				series.subscribe();

				expect(count).toEqual(1);
			})));

			it('should return an Observable of RateSeries', async(inject([MockBackend, OpenExchangeService], (backend: MockBackend, openExchange: OpenExchangeService) => {
				backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(new Response(new ResponseOptions({
					body,
					status: 200
				}))));

				openExchange.series(new Date(startDate), new Date(endDate), [euro])
					.subscribe((series) => {
						expect(series instanceof RateSeries)
							.toBeTruthy();
					});
			})));
		});
	});
});
