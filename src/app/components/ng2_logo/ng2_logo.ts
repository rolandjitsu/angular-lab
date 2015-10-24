import {
	ElementRef,
	ViewEncapsulation,
	Component,
	OnDestroy
} from 'angular2/angular2';

import { Icon } from '../../services';

@Component({
	selector: 'ng2-logo',
	encapsulation: ViewEncapsulation.Emulated, // ViewEncapsulation.Emulated, ViewEncapsulation.Native, ViewEncapsulation.None (default)
	template: '',
	styleUrls: [
		'app/components/ng2_logo/ng2_logo.css'
	]
})

export class Ng2Logo implements OnDestroy {
	el;
	constructor(elementRef: ElementRef,	icon: Icon) {
		this.el = elementRef.nativeElement;
		icon.get('assets/glyphs/ng2.svg').then((svg) => {
			this.el.appendChild(svg);
		});
	}
	onDestroy() {
		let svg = this.el.querySelector('svg');
		if (svg) this.el.removeChild(svg);
	}
}