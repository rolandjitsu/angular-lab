import { ShadowDomStrategy, NativeShadowDomStrategy } from 'angular2/render';
import { bind } from 'angular2/angular2';
import { document } from 'angular2/src/facade/browser';

export var hasShadowDom: boolean = Boolean(document && document.body && document.body.createShadowRoot);

export var shadowDomInjectables: Array<any> = !hasShadowDom ? [] : [
	bind(ShadowDomStrategy).toClass(NativeShadowDomStrategy)
];