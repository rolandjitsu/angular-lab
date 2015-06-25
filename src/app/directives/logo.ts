import { Directive } from 'angular2/annotations';
import { ElementRef } from 'angular2/core';

import { supportsNativeShadowDOM } from 'common/shadow_dom';
import { IconStore } from 'app/services';

@Directive({
	selector: '[logo]'
})

export class Logo {
	constructor(private elementRef: ElementRef,	public icon: IconStore) {
		let el = this.elementRef.nativeElement;
		let that: Logo = this;
		let root;
		if (supportsNativeShadowDOM) root = el.createShadowRoot();
		else root = el; 
		this.icon.get('media/ng.svg').then((svg) => {
			root.appendChild(svg);
		});
	}
}