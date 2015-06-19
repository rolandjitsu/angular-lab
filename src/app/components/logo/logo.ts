import { Component, View } from 'angular2/annotations';
import { ViewContainerRef } from 'angular2/core'
import { RouterLink } from 'angular2/router';

import { Animation, AnimationEndObserver } from 'app/services';

@Component({
	selector: 'logo',
	properties: [
		'move'
	]
})

@View({
	templateUrl: 'app/components/logo/logo.html',
	styles: [
		'@import "logo.css";'
	],
	directives: [
		RouterLink
	]
})

export class Logo {
	element: HTMLElement;
	constructor(viewContainer: ViewContainerRef) {
		this.element = viewContainer.element.domElement;
		Animation.rAF(
			(_) => this.element.classList.add('js-in'),
			this
		);
		let sub = AnimationEndObserver.subscribe(
			this.element,
			(event) => {
				if (event.animationName === 'in') this.element.className = this.element.className.replace('js-in', 'js-opaque');
				else if (event.animationName === 'move') {
					this.element.classList.remove('js-move', 'js-opaque');
					this.element.classList.add('js-unfix');
					sub.disconnect();
				}
			},
			this
		);
	}
	set move(move: boolean) {
		if (!move) return;
		Animation.rAF(
			(_) => this.element.classList.add('js-move'),
			this
		);
	}
}