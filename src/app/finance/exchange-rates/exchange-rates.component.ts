import {Component} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {ExchangeService} from '../shared/exchange.service';
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

	private rtl: boolean;

	private currenciesSource: BehaviorSubject<Currency[]> = new BehaviorSubject<Currency[]>([]);
	currencies: Observable<Currency[]> = this.currenciesSource.asObservable(); // tslint:disable-line: member-ordering

	constructor(exchange: ExchangeService) {
		exchange.currencies()
			.subscribe((currencies) => {
				this.currenciesSource.next(currencies.toArray());
				this.from.currency = currencies.findByCode('EUR') as Currency;
				this.to.currency = currencies.findByCode('USD') as Currency;
				this.calculate();
			});

		this.converter = exchange.converter();

		this.converter.output.subscribe(([value]) => {
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
