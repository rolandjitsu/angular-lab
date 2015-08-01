import { PipeFactory, NullPipeFactory } from 'angular2/angular2';

import { LowerCaseFactory } from './pipes/lowercase';

export const lowercase: Array<PipeFactory> = [
	new LowerCaseFactory(),
	new NullPipeFactory()
];