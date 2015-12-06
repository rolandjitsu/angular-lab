import { isFunction } from './lang';

let ns = 0;
if (performance && isFunction(performance.now) && performance.timing) ns = performance.timing.navigationStart;

let animationEndEventName = (() => {
	let fakeEl: HTMLElement = document.createElement('fake-el');
	let animationEndEventNames = {
		'-webkit-animation': 'webkitAnimationEnd',
		'-moz-animation': 'animationend',
		'-o-animation': 'oAnimationEnd',
		'animation': 'animationend'
	};
	for (let eventName in animationEndEventNames) {
		if (typeof fakeEl.style[eventName] !== 'undefined') return animationEndEventNames[eventName];
	}
	return null;
})();

export class AnimationEndObservable {
	element: Element;
	handler: EventListener;
	constructor(element: Element, handler: EventListener) {
		this.element = element;
		this.handler = handler;
		this.element.addEventListener(animationEndEventName, this.handler, false);
	}
	static subscribe(element: Element, done: Function, context?: any): AnimationEndObservable {
		return new AnimationEndObservable(element, event => {
			done.apply(context, [event]);
		});
	}
	dispose() {
		this.element.removeEventListener(animationEndEventName, this.handler);
	}
}

export class Animation {
	static rAF(fn: Function, context?: any): number {
		return requestAnimationFrame(timestamp => fn.apply(context, [timestamp + ns]));
	}
	static cAF (id: number): void {
		cancelAnimationFrame(id);
	}
}