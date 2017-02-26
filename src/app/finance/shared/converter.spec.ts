import {async} from '@angular/core/testing';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/take';

import {Rates} from './rates';
import {Converter} from './converter';
import {Currency} from './currencies';


describe('Angular Lab', () => {
	describe('Converter', () => {
		let converter: Converter;
		beforeEach(() => {
			const rates = new Rates({
				disclaimer: '',
				license: '',
				base: 'USD',
				timestamp: Date.now(),
				rates: {
					EUR: 0.5
			}});
			converter = new Converter(Observable.create((observer: Observer<Rates>) => {
				observer.next(rates);
			}))
		});

		it('should have {source, output} properties', () => {
			expect(converter.source).not.toBeUndefined();
			expect(converter.output).not.toBeUndefined();
			expect(converter.source instanceof BehaviorSubject)
				.toBeTruthy();
			expect(converter.output instanceof Observable)
				.toBeTruthy();
		});

		it('should convert an array of values from one Currency to another', async(() => {
			const usd = new Currency('USD', 'US Dollar');
			const euro = new Currency('EUR', 'Euro');

			converter.output.take(1)
				.subscribe(([value]) => {
					expect(value).toEqual(0.5);
				});

			converter.source.next([{
				value: 1,
				from: usd,
				to: euro
			}]);
		}));

		it('should not emit values if the same input is sent', async(() => {
			const from = new Currency('USD', 'US Dollar');
			const to = new Currency('EUR', 'Euro');

			let count = 0;
			converter.output.take(2)
				.subscribe(([value]) => {
					expect(value).toEqual(0.5);
					count++;
				});

			const input = {from, to, value: 1};
			converter.source.next([input]);
			converter.source.next([input]);

			expect(count).toEqual(1);
		}));
	});
});
