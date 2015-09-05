import {
	LifecycleEvent,
	ElementRef,
	Component,
	View,
	ViewEncapsulation,
	OnDestroy
} from 'angular2/angular2';

import { isNativeShadowDomSupported } from 'common/lang';
import { IconStore } from 'common/icon';

@Component({
	selector: 'icon',
	properties: [
		'src'
	],
	lifecycle: [
		LifecycleEvent.onDestroy
	]
})

@View({
	encapsulation: isNativeShadowDomSupported ? ViewEncapsulation.NATIVE : ViewEncapsulation.EMULATED, // EMULATED, NATIVE, NONE (default)
	templateUrl: 'app/components/icon/icon.html', // remove once the relative resolve of styles will work properly
	styleUrls: [
		'app/components/icon/icon.css'
	]
})

export class Icon implements OnDestroy {
	el;
	constructor(private elementRef: ElementRef, public icon: IconStore) {
		this.el = this.elementRef.nativeElement;
		if (isNativeShadowDomSupported) this.el = this.el.shadowRoot;
	}
	set src(src: string) {
		let that: Icon = this;
		this.icon.get(src).observer({
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