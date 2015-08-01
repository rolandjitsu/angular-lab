import {
	AsyncTestCompleter,
	TestComponentBuilder,
	describe,
	expect,
	inject,
	it
} from 'angular2/test_lib';
import { DOM } from 'angular2/src/dom/dom_adapter';
import { Component, View } from 'angular2/angular2';

import { Logo } from 'app/directives';

export function main () {
	describe('logo directive', () => {
		it('should append an svg as child of self', inject([TestComponentBuilder, AsyncTestCompleter], (tcb: TestComponentBuilder, async) => {
			let html = '<div><div class="logo" logo></div>';
			tcb
				.overrideTemplate(TestComponent, html)
				.createAsync(TestComponent)
				.then((rootTC) => {
					rootTC.detectChanges();
					let logo = DOM.querySelector(rootTC.nativeElement, '.logo');
					
					
					console.log(logo);
					// expect(input === activeEl).toBe(true);
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
		Logo
	]
})
class TestComponent {
	constructor() {}
}