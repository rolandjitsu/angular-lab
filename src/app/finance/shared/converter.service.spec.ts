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

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/take';

import {OpenExchangeService} from './exchange.service';
import {ConverterService} from './converter.service';
import {Converter} from './converter';
import {Currency} from './currencies';


export function provideConverterServiceFactory(openExchange: OpenExchangeService): ConverterService {
	return new ConverterService(openExchange);
}
export function provideExchangeServiceFactory(http: Http): OpenExchangeService {
	return new OpenExchangeService(http);
}
export function provideHttpFactory(connectionBackend: ConnectionBackend, defaultOptions: BaseRequestOptions): Http {
	return new Http(connectionBackend, defaultOptions);
}


describe('Angular Lab', () => {
	describe('ConverterService', () => {
		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [
					{
						provide: ConverterService,
						useFactory: provideConverterServiceFactory,
						deps: [
							OpenExchangeService
						]
					},
					{
						provide: OpenExchangeService,
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

		it('should have {ratesFetchError} properties', inject([MockBackend, ConverterService], (backend: MockBackend, cs: ConverterService) => {
			expect(cs.ratesFetchError).not.toBeUndefined();
			expect(cs.ratesFetchError instanceof Observable)
				.toBeTruthy();
		}));

		describe('create()', () => {
			it('should return a Converter that works', async(inject([MockBackend, ConverterService], (backend: MockBackend, cs: ConverterService) => {
				backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(new Response(new ResponseOptions({
					body: {
						disclaimer: '',
						license: '',
						timestamp: Date.now(),
						base: 'USD',
						rates: {
							EUR: 0.5
						}
					},
					status: 200
				}))));

				const converter = cs.create();
				expect(converter instanceof Converter)
					.toBeTruthy();

				const usd = new Currency('USD', 'US Dollar');
				const euro = new Currency('EUR', 'Euro');

				const obs = converter.output.take(1);
				const obsSpy = jasmine.createSpy('convert');
				obs.subscribe(([value]) => {
					expect(value).toEqual(0.5);
					obsSpy();
				});

				converter.input.next([{
					value: 1,
					from: usd,
					to: euro
				}]);

				expect(obsSpy)
					.toHaveBeenCalled();
			})));
		});

		describe('#ratesFetchError', () => {
			it('should emit if an error occurred when making the request to Open Exchange', async(inject([MockBackend, ConverterService], (backend: MockBackend, cs: ConverterService) => {
				backend.connections.subscribe((connection: MockConnection) => connection.mockError(new Error('Unauthorized')));
				let count = 0;
				cs.ratesFetchError.take(1)
					.subscribe(() => {
						count++;
					});
				cs.create();
				expect(count)
					.toEqual(1);
			})));
		});

		describe('retryRatesFetch()', () => {
			it('should retry to fetch rates from Open Exchange', async(inject([MockBackend, ConverterService], (backend: MockBackend, cs: ConverterService) => {
				let canReturnRates = false;
				backend.connections.subscribe((connection: MockConnection) => {
					if (!canReturnRates) {
						connection.mockError(new Error('Unauthorized'));
					} else {
						connection.mockRespond(new Response(new ResponseOptions({
							body: {
								disclaimer: '',
								license: '',
								timestamp: Date.now(),
								base: 'USD',
								rates: {
									EUR: 0.5
								}
							},
							status: 200
						})));
					}
				});

				let errorCount = 0;
				cs.ratesFetchError.take(1)
					.subscribe(() => {
						errorCount++;
					});
				const converter = cs.create();
				canReturnRates = true;
				cs.retryRatesFetch();

				expect(errorCount)
					.toEqual(1);

				const usd = new Currency('USD', 'US Dollar');
				const euro = new Currency('EUR', 'Euro');

				const obs = converter.output.take(1);
				const obsSpy = jasmine.createSpy('convert');
				obs.subscribe(([value]) => {
					expect(value).toEqual(0.5);
					obsSpy();
				});

				converter.input.next([{
					value: 1,
					from: usd,
					to: euro
				}]);

				expect(obsSpy)
					.toHaveBeenCalled();
			})));
		});
	});
});
