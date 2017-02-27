// tslint:disable:no-magic-numbers
import {Rates} from './rates';
import {Fx} from './fx';
import {Currency} from './currencies';


describe('Angular Lab', () => {
	describe('Fx', () => {
		let fx: Fx;
		beforeEach(() => {
			const rates = new Rates({
				disclaimer: '',
				license: '',
				base: 'USD',
				timestamp: Date.now(),
				rates: {
					RON: 0.25,
					EUR: 0.5
				}});
			fx = new Fx(rates);
		});

		describe('convert()', () => {
			it('should convert a value (or array of values) from one Currency to another', () => {
				const usd = new Currency('USD', 'US Dollar');
				const euro = new Currency('EUR', 'Euro');
				const ron = new Currency('RON', 'Romanian Leu');

				expect(fx.convert(1, usd, euro))
					.toEqual(2);
				expect(fx.convert([1, 2], usd, euro))
					.toEqual([2, 4]);
				expect(fx.convert(1, euro, usd))
					.toEqual(0.5);

				expect(fx.convert(1, euro, ron))
					.toEqual(0.5 * (1 / 0.25));
			});
		});
	});
});
