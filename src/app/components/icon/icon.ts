import { ViewContainerRef, Component, View, ViewEncapsulation } from 'angular2/angular2';
import { ObservableWrapper } from 'angular2/src/facade/async';

import { isNativeShadowDOMSupported } from 'common/shadow_dom';
import { IconStore } from 'common/icon';

@Component({
	selector: 'icon',
	properties: [
		'src'
	]
})

@View({
	encapsulation: isNativeShadowDOMSupported ? ViewEncapsulation.NATIVE : ViewEncapsulation.EMULATED, // EMULATED (default), NATIVE, NONE
	templateUrl: 'app/components/icon/icon.html', // remove once the relative resolve of styles will work properly
	styleUrls: [
		'app/components/icon/icon.css'
	]
})

export class Icon {
	el;
	constructor(private viewContainer: ViewContainerRef, public icon: IconStore) {
		this.el = this.viewContainer.element.nativeElement;
	}
	set src(src: string) {
		let root;
		if (isNativeShadowDOMSupported) root = this.el.shadowRoot;
		else root = this.el;
		ObservableWrapper.subscribe(this.icon.get(src), (svg) => {
			root.appendChild(svg);
		});
	}
}