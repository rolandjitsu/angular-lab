import { ShadowDomStrategy, NativeShadowDomStrategy } from 'angular2/render';
import { bind } from 'angular2/angular2';
import { document } from 'angular2/src/facade/browser';

export var supportsNativeShadowDOM: boolean = Boolean(document && document.body && document.body.createShadowRoot);

export var shadowDomInjectables: Array<any> = !supportsNativeShadowDOM ? [] : [
	bind(ShadowDomStrategy).toClass(NativeShadowDomStrategy)
];