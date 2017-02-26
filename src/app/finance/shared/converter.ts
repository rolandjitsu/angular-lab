import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/multicast';
import 'rxjs/add/operator/skipWhile';

import {Currency} from './currencies';
import {Rates} from './rates';
import {Fx} from './fx';


export interface Input {
	value: number;
	from: Currency;
	to: Currency;
}


export class Converter {
	input: BehaviorSubject<Input[]> = new BehaviorSubject<Input[]>([]);
	output: Observable<number[]> = this.input.asObservable()
		.skipWhile((item) => item.length === 0)
		.distinctUntilChanged(compare)
		.mergeMap((input: Input[]) => this.fx.map((fx) => input.map(({value, to, from}) => toDecimal(fx.convert(value, to, from) as number)))) // Idempotent operation
		.multicast(new ReplaySubject())
		.refCount();

	private fx: Observable<Fx> = this.rates.map((rates) => new Fx(rates))
		.multicast(new ReplaySubject())
		.refCount();

	constructor(private rates: Observable<Rates>) {}
}


function compare(previous: Input[], current: Input[]): boolean {
	return previous.length === current.length && previous.every((item, index) => {
			const pi = current[index];
			return (Number.isNaN(item.value) && Number.isNaN(pi.value) || item.value === pi.value)
				&& (item.to instanceof Currency && item.to.equals(pi.to) || item.to === pi.to)
				&& (item.from instanceof Currency && item.from.equals(pi.from) || item.from === pi.from);
		});
}

function toDecimal(num: number, decimals: number = 2): number {
	if (Number.isNaN(num)) {
		return NaN;
	}
	const n = Math.pow(10, decimals);
	return Math.round(num * n) / n;
}
