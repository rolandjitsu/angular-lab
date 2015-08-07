import { ElementRef, Directive } from 'angular2/angular2';
import { ObservableWrapper } from 'angular2/src/facade/async';

import { isNativeShadowDOMSupported } from 'common/shadow_dom';
import { IconStore } from 'common/icon';

@Directive({
	selector: '[logo]'
})

export class Logo {
	constructor(private elementRef: ElementRef,	public icon: IconStore) {
		let el = this.elementRef.nativeElement;
		let root;
		if (isNativeShadowDOMSupported) root = el.createShadowRoot();
		else root = el;
		ObservableWrapper.subscribe(icon.get('media/ng.svg'), (svg) => {
			root.appendChild(svg);
		});
	}
}