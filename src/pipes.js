import { PipeFactory } from 'angular2/src/change_detection/pipes/pipe';
import { PipeRegistry, NullPipeFactory, defaultPipes } from 'angular2/change_detection';
import { bind } from 'angular2/di';

import { LowerCaseFactory } from 'pipes/lowercase';

export var lowercase : List<PipeFactory> = [new LowerCaseFactory(), new NullPipeFactory()];

let pipes = Object.assign({}, defaultPipes, {
	lowercase
});

export const pipeInjectables = [
	bind(PipeRegistry).toValue(
		new PipeRegistry(pipes)
	)
]