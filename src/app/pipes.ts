import { Pipes, PipeFactory, NullPipeFactory, defaultPipes } from 'angular2/change_detection';
import { bind } from 'angular2/angular2';

import { LowerCaseFactory } from './pipes/lowercase';
// import { DateFactory } from './pipes/date';

export const lowercase: Array<PipeFactory> = [new LowerCaseFactory(), new NullPipeFactory()];
// export const date: Array<PipeFactory> = [new DateFactory(), new NullPipeFactory()];

// let pipes: Pipes  = Object.assign({}, defaultPipes, {
// 	lowercase
// });


export const pipeInjectables: Array<any> = [
	bind(Pipes).toValue(
		Pipes.append({
			lowercase
		})
	)
];