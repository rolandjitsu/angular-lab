import { ShadowDomStrategy, NativeShadowDomStrategy } from 'angular2/render';
import { bind } from 'angular2/angular2';
import { document } from 'angular2/src/facade/browser';

export const isNativeShadowDOMSupported: boolean = Boolean(document && document.body && document.body.createShadowRoot); // http://caniuse.com/#feat=shadowdom

export const shadowDomInjectables: Array<any> = !isNativeShadowDOMSupported ? [] : [
	bind(ShadowDomStrategy).toClass(NativeShadowDomStrategy)
];