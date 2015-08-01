import { document } from 'angular2/src/facade/browser';

export const isNativeShadowDOMSupported: boolean = Boolean(document && document.body && document.body.createShadowRoot); // http://caniuse.com/#feat=shadowdom