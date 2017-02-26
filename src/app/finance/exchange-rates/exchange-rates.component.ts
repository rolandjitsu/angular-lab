import {Component} from '@angular/core';
import {MdSnackBar} from '@angular/material';

import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {OpenExchangeService} from '../shared/exchange.service';
import {Currency} from '../shared/currencies';
import {Converter} from '../shared/converter';


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

	constructor(snackbar: MdSnackBar, openExchange: OpenExchangeService) {
		const handleOpenExchangeError = () => {
			snackbar.open('Failed to access Open Exchange APIs.', 'Ok');
			this.ratesAreUnavailableSource.next(true);
		};

		openExchange.currencies()
			.subscribe((currencies) => {
				this.currenciesSource.next(currencies.toArray());
				this.from.currency = currencies.findByCode('EUR') as Currency;
				this.to.currency = currencies.findByCode('USD') as Currency;
				this.calculate();
			}, handleOpenExchangeError);

		this.converter = openExchange.converter();

		this.converter.output.subscribe(([value]) => {
			if (this.rtl) {
				this.from.value = value;
			} else {
				this.to.value = value;
			}

		}, handleOpenExchangeError);
	}

	calculate(rtl: boolean = false): void {
		this.rtl = rtl;
		if (rtl) {
			this.converter.source.next([{
				value: this.to.value,
				to: this.from.currency,
				from: this.to.currency
			}]);
		} else {
			this.converter.source.next([{
				value: this.from.value,
				to: this.to.currency,
				from: this.from.currency
			}]);
		}
	}
}
