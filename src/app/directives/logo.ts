import {
	Inject,
	ElementRef,
	Directive,
	OnDestroy
} from 'angular2/angular2';

import { isNativeShadowDomSupported } from 'common/lang';
import { IconStore } from 'common/icon';

@Directive({
	selector: '[logo]'
})

export class Logo implements OnDestroy {
	el;
	constructor(@Inject(ElementRef) elementRef,	icon: IconStore) {
		let that: Logo = this;
		this.el = elementRef.nativeElement;
		if (isNativeShadowDomSupported) this.el = this.el.createShadowRoot();
		icon.get('media/ng.svg').observer({
			next: (svg) => {
				that.el.appendChild(svg);
			}
		});
	}
	onDestroy() {
		let svg = this.el.querySelector('svg');
		if (svg) this.el.removeChild(svg);
	}
}