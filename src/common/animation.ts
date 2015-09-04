import { isFunction } from './facade';

let time: Function;
let ns: number = 0;
let rAF: (callback: Function) => number = window['requestAnimationFrame'] || window['webkitRequestAnimationFrame'] || window['mozRequestAnimationFrame'];
let cAF: (rAFId: number) => void = window['cancelAnimationFrame'] || window['webkitCancelAnimationFrame'] || window['webkitCancelRequestAnimationFrame'] || window['mozCancelRequestAnimationFrame'];

function getAnimationEndEventName (): string {
	let fakeEl: HTMLElement = document.createElement('fakeelement');
	let animationEndEventNames = {
		'animation': 'animationend',
		'-o-animation': 'oAnimationEnd',
		'-moz-animation': 'animationend',
		'-webkit-animation': 'webkitAnimationEnd'
	};
	for (let eventName in animationEndEventNames) {
		if (typeof fakeEl.style[eventName] !== 'undefined') return animationEndEventNames[eventName];
	}
	return null;
}

if (performance && isFunction(performance.now) && performance.timing) {
	ns = performance.timing.navigationStart;
	time = function (): number {
		return performance.now() + ns;
	};
}
else {
	time = Date.now;
}

export class AnimationEndObserver {
	element: Element;
	event: string = getAnimationEndEventName();
	handler: EventListener;
	constructor(element: Element, handler: EventListener) {
		this.element = element;
		this.handler = handler;
		this.element.addEventListener(this.event, this.handler, false);
	}
	static subscribe(element: Element, done: Function, context?: any): AnimationEndObserver {
		return new AnimationEndObserver(element, event => {
			done.apply(context, [event]);
		});
	}
	disconnect() {
		this.element.removeEventListener(this.event, this.handler);
	}
}

export class Animation {
	static rAF(fn: Function, context?: any): number {
		return rAF(timestamp => fn.apply(context, [timestamp + ns]));
	}
	static cAF (id: number): void {
		cAF(id);
	}
}