// tslint:disable:no-magic-numbers
import {Currency} from './currencies';
import {parseOpenExchangeDate, RateSeries} from './series';


describe('Angular Lab', () => {
	describe('RateSeries', () => {
		let series: RateSeries;
		const startDate = '2013-01-01';
		const endDate = '2013-01-03';
		const euro = new Currency('EUR', 'Euro');
		beforeEach(() => {
			series = new RateSeries([euro], {
				disclaimer: '',
				license: '',
				start_date: startDate,
				end_date: endDate,
				base: 'USD',
				rates: {
					'2013-01-01': {
						EUR: 0.5
					},
					'2013-01-02': {
						EUR: 0.65
					},
					'2013-01-03': {
						EUR: 0.60
					}
				}
			});
		});

		it('should have {start, end, base} properties', () => {
			for (const prop of [series.start, series.end, series.base]) {
				expect(prop).not.toBeUndefined();
			}
			expect(series.start instanceof Date)
				.toBeTruthy();
			expect(series.end instanceof Date)
				.toBeTruthy();
			expect(series.start)
				.toEqual(new Date(startDate));
			expect(series.end)
				.toEqual(new Date(endDate));
			expect(series.base)
				.toEqual('USD');
		});

		describe('has()', () => {
			it('should check for presence of a Currency', () => {
				expect(series.has(null))
					.toBeFalsy();
				expect(series.has(euro))
					.toBeTruthy();
			});
		});

		describe('get()', () => {
			it('should get the series for a Currency', () => {
				const euroSeries = series.get(euro);

				expect(Array.isArray(euroSeries))
					.toBeTruthy();
				expect(euroSeries.length)
					.toEqual(3);

				expect(euroSeries.every((item) => typeof item.date === 'number' && typeof item.rate === 'number'))
					.toBeTruthy();
			});
		});
	});

	describe('parseOpenExchangeDate()', () => {
		it('should convert a date string to UTC date', () => {
			const dateStr = '2013-01-01';
			const date = new Date(dateStr);

			expect(parseOpenExchangeDate(dateStr))
				.toEqual(date.getTime());
		});
	});
});
