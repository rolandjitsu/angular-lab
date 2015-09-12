import {
	LifecycleEvent,
	ElementRef,
	Directive,
	OnDestroy
} from 'angular2/angular2';

import { isNativeShadowDomSupported } from 'common/lang';
import { IconStore } from 'common/icon';

@Directive({
	selector: '[logo]',
	lifecycle: [
		LifecycleEvent.OnDestroy
	]
})

export class Logo implements OnDestroy {
	el;
	constructor(private elementRef: ElementRef,	public icon: IconStore) {
		let that: Logo = this;
		this.el = this.elementRef.nativeElement;
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