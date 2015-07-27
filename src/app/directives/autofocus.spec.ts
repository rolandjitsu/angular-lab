import {
	AsyncTestCompleter,
	TestComponentBuilder,
	describe,
	expect,
	inject,
	it
} from 'angular2/test_lib';
import { DOM } from 'angular2/src/dom/dom_adapter';
import { Component, View } from 'angular2/annotations';

import { Autofocus } from './autofocus';

export function main () {
	describe('autofocus directive', () => {
		it('should focus on input', inject([TestComponentBuilder, AsyncTestCompleter], (tcb: TestComponentBuilder, async) => {
			let html = '<div><input autofocus></div>';
			tcb
				.overrideTemplate(TestComponent, html)
				.createAsync(TestComponent)
				.then((rootTC) => {
					rootTC.detectChanges();
					let input = DOM.querySelector(rootTC.nativeElement, 'input');
					let activeEl = document.activeElement;
					expect(input === activeEl).toBe(true);
					async.done();
				});
		}));
	});
}

@Component({
	selector: 'test-cmp'
})
@View({
	directives: [
		Autofocus
	]
})
class TestComponent {
	constructor() {}
}