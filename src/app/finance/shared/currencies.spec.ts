import {Currencies, Currency} from './currencies';

describe('Angular Lab', () => {
	describe('Currencies', () => {
		let currencies: Currencies;
		beforeEach(() => {
			currencies = new Currencies({
				USD: 1,
				EUR: 0.96
			});
		});

		describe('findByCode()', () => {
			it('should return a Currency or undefined', () => {
				const usd = currencies.findByCode('USD');
				expect(currencies.findByCode('TEST'))
					.toBeUndefined();
				expect(usd instanceof Currency)
					.toBeTruthy();
			});
		});

		describe('toArray()', () => {
			it('should return an array of Currency', () => {
				const arr = currencies.toArray();
				expect(Array.isArray(arr))
					.toBeTruthy();
				expect(arr.every((currency) => currency instanceof Currency))
					.toBeTruthy();
			});
		});
	});

	describe('Currency', () => {
		it('should have {code, name} properties', () => {
			const usd = new Currency('USD', 'US Dollar');
			expect(usd.code).not.toBeUndefined();
			expect(usd.name).not.toBeUndefined();
			expect(usd.code)
				.toEqual('USD');
			expect(usd.name)
				.toEqual('US Dollar');
		});

		describe('equals()', () => {
			it('should compare a Currency to another value', () => {
				const usd = new Currency('USD', 'US Dollar');
				const euro = new Currency('EUR', 'Euro');

				expect(usd.equals(null))
					.toBeFalsy();
				expect(usd.equals(euro))
					.toBeFalsy();
				expect(usd.equals(usd))
					.toBeTruthy();
			});
		});
	});
});
