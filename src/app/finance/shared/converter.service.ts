import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/never';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/multicast';
import 'rxjs/add/operator/skipWhile';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/take';

import {OpenExchangeService} from './exchange.service';
import {Converter} from './converter';
import {Rates} from './rates';


@Injectable()
export class ConverterService {
	private ratesSource: BehaviorSubject<Rates | null> = new BehaviorSubject<Rates | null>(null);
	private rates: Observable<Rates> = this.ratesSource.asObservable()
		.skipWhile((item) => item === null); // tslint:disable-line: member-ordering

	private ratesFetchErrorSource: BehaviorSubject<Error | null> = new BehaviorSubject<Error | null>(null);
	ratesFetchError: Observable<Error> = this.ratesFetchErrorSource.asObservable()
		.skipWhile((item) => item === null); // tslint:disable-line: member-ordering

	constructor(private openExchange: OpenExchangeService) {}

	create(): Converter {
		return new Converter(this.fetchRates());
	}
	retryRatesFetch(): void {
		this.fetchRates();
	}

	private fetchRates(): any {
		Observable.of(this.ratesSource.getValue())
			.switchMap((rates) => rates !== null ? Observable.never() : this.openExchange.rates())
			.catch(() => {
				this.ratesFetchErrorSource.next(new Error('Open Exchange APIs are unavailable or there was an error.'));
				return Observable.never();
			})
			.subscribe((rates) => {
				if (rates instanceof Rates) {
					this.ratesSource.next(rates);
				}
			});

		return this.rates;
	}
}
