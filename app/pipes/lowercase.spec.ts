import {
	describe,
	it,
	expect,
	beforeEach
} from 'angular2/testing';

import {LowerCasePipe} from './lowercase';

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
	describe('.transform()', () => {
		it('should only support string objects', () => {
			expect(() => pipe.transform({})).toThrowError();
		});
		it('should lowercase when there is a new value', () => {
			let val = pipe.transform(upper);
			expect(val).toEqual(lower);
			let val2 = pipe.transform('WAT');
			expect(val2).toEqual('wat');
		});
		it('should return lowercase', () => {
			let val = pipe.transform(upper);
			expect(val).toEqual(lower);
		});
	});
});
