import {
	describe,
	it,
	expect,
	beforeEach
} from 'angular2/test_lib';

import { LowerCasePipe } from './lowercase';

export function main () {
	describe('LowerCasePipe', () => {
		let pipe;
		let str;
		let upper;
		let lower;
		beforeEach(() => {
			pipe = new LowerCasePipe();
			str = 'something';
			lower = 'something';
			upper = 'SOMETHING';
		});
		describe('supports', () => {
			it('should support strings', () => { expect(pipe.supports(str)).toBe(true); });
			it('should not support other objects', () => {
				expect(pipe.supports(new Object())).toBe(false);
				expect(pipe.supports(null)).toBe(false);
			});
		});
		describe('transform', () => {
			it('should return lowercase', () => { expect(pipe.transform(upper)).toEqual(lower); });
			it('should lowercase when there is a new value', () => {
				expect(pipe.transform(upper)).toEqual(lower);
				expect(pipe.transform('WAT')).toEqual('wat');
			});
		});
	});
}