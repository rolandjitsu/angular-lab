import { Component, View } from 'angular2/annotations';
import { ViewContainerRef } from 'angular2/core';

import { isNativeShadowDOMSupported } from 'common/shadow_dom';
import { IconStore } from 'app/services';

@Component({
	selector: 'icon',
	properties: [
		'src'
	]
})

@View({
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
		let that: Icon = this;
		let root;
		if (isNativeShadowDOMSupported) root = this.el.shadowRoot;
		else root = this.el; 
		this.icon.get(src).then((svg) => {
			root.appendChild(svg);
		});
	}
}