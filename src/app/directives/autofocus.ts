import { Directive } from 'angular2/annotations';
import { ElementRef } from 'angular2/core';

@Directive({
	selector: '[autofocus]'
})

export class Autofocus {
	constructor(el: ElementRef) {
		el.nativeElement.focus();
	}
}