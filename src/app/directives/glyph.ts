import {
	ElementRef,
	Directive,
	OnDestroy
} from 'angular2/angular2';

import { isNativeShadowDomSupported } from '../../common/lang';
import { Icon } from '../services';

@Directive({
	selector: 'glyph',
	inputs: [
		'src'
	]
})

export class Glyph implements OnDestroy {
	el;
	private _icon: Icon;
	constructor(elementRef: ElementRef, icon: Icon) {
		this.el = elementRef.nativeElement;
		if (isNativeShadowDomSupported) this.el = this.el.createShadowRoot();
		this._icon = icon;
	}
	set src(src: string) {
		this._icon.get(src).subscribe((svg) => {
			this.el.appendChild(svg);
		});
	}
	onDestroy() {
		let svg = this.el.querySelector('svg');
		if (svg) this.el.removeChild(svg);
	}
}