import {Currency} from './currencies';


export interface RatesResponse {
	disclaimer: string;
	license: string;
	timestamp: number;
	base: string;
	rates: {[key: string]: number};
}

export class Rates {
	timestamp: Date;
	base: string;
	private list: Map<string, number>;
	constructor(source: RatesResponse) {
		this.base = source.base;
		this.timestamp = new Date(source.timestamp);
		const {rates} = source;
		this.list = new Map(Object.keys(rates)
			.map<[string, number]>((code: string) => ([
				code, rates[code]
			]))
			.concat([
				[this.base, 1]
			])
		);
	}
	has(currency: Currency): boolean {
		if (currency instanceof Currency) {
			return this.list.has(currency.code);
		}
		return false;
	}
	get(currency: Currency): number {
		if (this.has(currency)) {
			return this.list.get(currency.code) as number;
		}
		return NaN;
	}
}
