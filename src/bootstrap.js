import { bind } from 'angular2/di';
import { bootstrap } from 'angular2/core';
import { ShadowDomStrategy, NativeShadowDomStrategy } from 'angular2/core';
import { StyleUrlResolver } from 'angular2/src/render/dom/shadow_dom/style_url_resolver';
import { PipeRegistry } from 'angular2/change_detection';

import { routerInjectables } from 'angular2/router';

import { App } from 'components/app';
import { pipes } from 'utils/pipes/pipes';

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
	bind(PipeRegistry).toValue(
		new PipeRegistry(pipes)
	),
	shadowDomInjectables,
	routerInjectables
]);