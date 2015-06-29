import { PipeRegistry, PipeFactory, NullPipeFactory, defaultPipes } from 'angular2/change_detection';
import { bind } from 'angular2/angular2';

import { LowerCaseFactory } from './pipes/lowercase';
import { DateFactory } from './pipes/date';

export var lowercase : Array<PipeFactory> = [new LowerCaseFactory(), new NullPipeFactory()];
export var date : Array<PipeFactory> = [new DateFactory(), new NullPipeFactory()];

let pipes = Object.assign({}, defaultPipes, {
	lowercase,
	date
});

export const pipeInjectables: Array<any> = [
	bind(PipeRegistry).toValue(
		new PipeRegistry(pipes)
	)
];