import { Directive } from 'angular2/annotations';
import { ElementRef } from 'angular2/core';

import { isNativeShadowDOMSupported } from 'common/shadow_dom';
import { IconStore } from 'app/services';

@Directive({
	selector: '[logo]'
})

export class Logo {
	constructor(private elementRef: ElementRef,	public icon: IconStore) {
		let el = this.elementRef.nativeElement;
		let root;
		if (isNativeShadowDOMSupported) root = el.createShadowRoot();
		else root = el;
		this.icon.get('media/ng.svg').then((svg) => {
			root.appendChild(svg);
		});
	}
}