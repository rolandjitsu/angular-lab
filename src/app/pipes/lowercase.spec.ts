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
		describe('transform', () => {
			it('should return lowercase', () => {
				let val = pipe.transform(upper);
				expect(val).toEqual(lower);
			});
			it('should lowercase when there is a new value', () => {
				let val = pipe.transform(upper);
				expect(val).toEqual(lower);
				let val2 = pipe.transform('WAT');
				expect(val2).toEqual('wat');
			});
			it('should not support other objects', () => { expect(() => pipe.transform(new Object())).toThrowError(); });
		});
	});
}