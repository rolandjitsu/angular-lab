import { Directive } from 'angular2/annotations';
import { ElementRef } from 'angular2/core';

import { supportsNativeShadowDOM } from 'common/shadow_dom';
import { IconStore } from 'app/services';

@Directive({
	selector: 'icon',
	properties: [
		'src'
	]
})

export class Icon {
	el;
	constructor(private elementRef: ElementRef,	public icon: IconStore) {
		this.el = this.elementRef.nativeElement;
	}
	set src(src: string) {
		let that: Icon = this;
		let root;
		if (supportsNativeShadowDOM) root = this.el.createShadowRoot();
		else root = this.el; 
		this.icon.get(src).then((svg) => {
			root.appendChild(svg);
		});
	}
}