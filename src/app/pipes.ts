import { PipeFactory, NullPipeFactory } from 'angular2/change_detection';

import { LowerCaseFactory } from './pipes/lowercase';

export const lowercase: Array<PipeFactory> = [
	new LowerCaseFactory(),
	new NullPipeFactory()
];