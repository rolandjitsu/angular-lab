import { PipeRegistry, PipeFactory, NullPipeFactory, defaultPipes } from 'angular2/change_detection';
import { bind } from 'angular2/angular2';

import { LowerCaseFactory } from './pipes/lowercase';

export var lowercase : Array<PipeFactory> = [new LowerCaseFactory(), new NullPipeFactory()];

let pipes = Object.assign({}, defaultPipes, {
	lowercase
});

export const pipeInjectables: Array<any> = [
	bind(PipeRegistry).toValue(
		new PipeRegistry(pipes)
	)
];