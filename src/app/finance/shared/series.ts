import {Currency} from './currencies';


export interface RateSeriesResponse {
	disclaimer: string;
	license: string;
	start_date: string;
	end_date: string;
	base: string;
	rates: {
		[key: string]: {[key: string]: number}
	};
}

export interface RateOnDate {
	date: number;
	rate: number;
}

export function parseOpenExchangeDate(str: string): number {
	const parts = str.split('-')
		.map((part) => parseInt(part, 10));
	const [year, month, date] = parts;
	return Date.UTC(year, month - 1, date);
}


export class RateSeries {
	start: Date;
	end: Date;
	base: string;
	private list: Map<Currency, RateOnDate[]>;
	constructor(currencies: Currency[], source: RateSeriesResponse) {
		this.base = source.base;
		this.start = new Date(source.start_date);
		this.end = new Date(source.end_date);
		const {rates} = source;
		this.list = new Map(currencies.map<[Currency, RateOnDate[]]>((currency) => [
			currency,
			Object.keys(rates)
				.map<RateOnDate>((date) => ({
					date: parseOpenExchangeDate(date),
					rate: rates[date][currency.code]
				}))
		]));
	}
	get(currency: Currency): RateOnDate[] {
		if (this.has(currency)) {
			return this.list.get(currency) as RateOnDate[];
		}
		return [];
	}
	has(currency: Currency): boolean {
		if (currency instanceof Currency) {
			return this.list.has(currency);
		}
		return false;
	}
}
