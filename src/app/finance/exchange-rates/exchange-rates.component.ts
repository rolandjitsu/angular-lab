import {Component} from '@angular/core';
import {MdSnackBar} from '@angular/material';

import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {OpenExchangeService} from '../shared/exchange.service';
import {Currency} from '../shared/currencies';
import {Converter} from '../shared/converter';
import {ConverterService} from '../shared/converter.service';


interface Source {
	value: number;
	currency: Currency;
}


@Component({
	selector: 'rj-exchange-rates',
	templateUrl: './exchange-rates.component.html',
	styleUrls: [
		'./exchange-rates.component.scss'
	]
})
export class ExchangeRatesComponent {
	from: Source = {value: 1} as Source;
	to: Source = {} as Source;
	converter: Converter;

	private ratesAreUnavailableSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	ratesAreUnavailable: Observable<boolean> = this.ratesAreUnavailableSource.asObservable(); // tslint:disable-line: member-ordering

	private rtl: boolean;

	private currenciesSource: BehaviorSubject<Currency[]> = new BehaviorSubject<Currency[]>([]);
	currencies: Observable<Currency[]> = this.currenciesSource.asObservable(); // tslint:disable-line: member-ordering

	constructor(snackbar: MdSnackBar, openExchange: OpenExchangeService, converter: ConverterService) {
		openExchange.currencies()
			.subscribe((currencies) => {
				this.currenciesSource.next(currencies.toArray());
				this.from.currency = currencies.findByCode('EUR') as Currency;
				this.to.currency = currencies.findByCode('USD') as Currency;
				this.calculate();
			}, () => {
				snackbar.open('Failed to load currencies from Open Exchange APIs.', 'Ok');
			});

		this.converter = converter.create();
		converter.ratesFetchError.subscribe(() => {
			this.ratesAreUnavailableSource.next(true);
			const toast = snackbar.open('Failed to load exchange rates from Open Exchange APIs.', 'Retry');
			toast.onAction()
				.subscribe(() => {
					converter.retryRatesFetch();
				});
		});
		this.converter.output.subscribe(([value]) => {
			this.ratesAreUnavailableSource.next(false);
			if (this.rtl) {
				this.from.value = value;
			} else {
				this.to.value = value;
			}

		});
	}

	calculate(rtl: boolean = false): void {
		this.rtl = rtl;
		if (rtl) {
			this.converter.input.next([{
				value: this.to.value,
				to: this.from.currency,
				from: this.to.currency
			}]);
		} else {
			this.converter.input.next([{
				value: this.from.value,
				to: this.to.currency,
				from: this.from.currency
			}]);
		}
	}
}
