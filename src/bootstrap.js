import { StyleUrlResolver } from 'angular2/src/render/dom/shadow_dom/style_url_resolver';
import { PipeRegistry } from 'angular2/change_detection';
import { bootstrap, ShadowDomStrategy, NativeShadowDomStrategy } from 'angular2/core';
import { bind } from 'angular2/di';

import { routerInjectables } from 'angular2/router';

import { pipeInjectables } from 'pipes';
import { serviceInjectables } from 'services';
import { App } from 'components/app';

let hasShadowDom = Boolean(
	document && document.body && document.body.createShadowRoot
);

let shadowDomInjectables = [
	!hasShadowDom
		? []
		: bind(ShadowDomStrategy).toFactory(
			styleUrlResolver => new NativeShadowDomStrategy(styleUrlResolver),
			[StyleUrlResolver]
		)
]

bootstrap(App, [
	shadowDomInjectables,
	routerInjectables,
	pipeInjectables,
	serviceInjectables
]);