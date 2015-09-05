import { ElementRef, Directive } from 'angular2/angular2';

import { isNativeShadowDomSupported } from 'common/lang';
import { IconStore } from 'common/icon';

@Directive({
	selector: '[logo]'
})

export class Logo {
	constructor(private elementRef: ElementRef,	public icon: IconStore) {
		let el = this.elementRef.nativeElement;
		let root;
		if (isNativeShadowDomSupported) root = el.createShadowRoot();
		else root = el;
		icon.get('media/ng.svg').observer({
			next: (svg) => {
				root.appendChild(svg);
			}
		});
	}
}