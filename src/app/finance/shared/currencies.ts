function toCurrency([code, name]: string[]): Currency {
	return new Currency(code, name);
}


export interface CurrenciesResponse {
	[key: string]: string;
}

export class Currency {
	constructor(public code: string, public name: string) {}
	equals(currency: any): boolean {
		if (currency instanceof Currency) {
			return this.code === currency.code;
		} else if (typeof currency === 'string') {
			return currency === this.code;
		}
		return false;
	}
}


export class Currencies {
	private list: Map<string, Currency>;
	constructor(source: CurrenciesResponse) {
		this.list = new Map(Object.keys(source)
			.map<[string, Currency]>((code: string) => ([
				code, toCurrency([code, source[code]])
			])));
	}
	findByCode(code: string): Currency | undefined {
		if (this.list.has(code)) {
			return this.list.get(code);
		}
	}
	toArray(): Currency[] {
		return Array.from(
			this.list.values()
		);
	}
}
