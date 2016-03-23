import {
	ElementRef,
	Component,
	ViewEncapsulation,
	OnDestroy
} from 'angular2/core';

import {Icon} from '../../services';

const COMPONENT_BASE_PATH = './app/common/glyph';

@Component({
	selector: 'glyph',
	encapsulation: ViewEncapsulation.Emulated, // ViewEncapsulation.Emulated, ViewEncapsulation.Native, ViewEncapsulation.None (default)
	template: '',
	styleUrls: [
		`${COMPONENT_BASE_PATH}/glyph.css`
	],
	inputs: [
		'src'
	]
})

export class Glyph implements OnDestroy {
	el: HTMLElement;
	private _icon: Icon;
	constructor(elementRef: ElementRef, icon: Icon) {
		this.el = elementRef.nativeElement;
		this._icon = icon;
	}
	set src(src: string) {
		this._icon.get(src).then((svg) => {
			if (this.el.children.length) {
				this.el.replaceChild(svg, this.el.firstChild);
			} else {
				this.el.appendChild(svg);
			}
		});
	}
	ngOnDestroy() {
		const svg = this.el.querySelector('svg');
		if (svg) {
			this.el.removeChild(svg);
		}
	}
}
