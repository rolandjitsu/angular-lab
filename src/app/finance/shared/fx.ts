import {Currency} from './currencies';
import {Rates} from './rates';


/**
 * Class for converting currencies.
 * Source: http://openexchangerates.github.io/money.js
 */
export class Fx {
	constructor(private rates: Rates) {}
	convert(value: number | number[], to: Currency, from: Currency): number | number[] {
		if (Array.isArray(value)) {
			return value.map((value) => this.convert(value, to, from) as number);
		}
		return value * this.rate(to, from);
	}

	private rate(to: Currency, from: Currency): number {
		if (to instanceof Currency && from instanceof Currency && this.rates.has(from) && this.rates.has(to)) {
			if (to.equals(this.rates.base)) {
				return 1 / this.rates.get(from);
			}
			return this.rates.get(to) * (1 / this.rates.get(from));
		}
		return NaN;
	}
}
