import { defaultPipes } from 'angular2/change_detection';
import { LowercasePipe } from './lowercase';

export var pipes = Object.assign({}, defaultPipes, {
	lowercase: [
		new LowercasePipe()
	]
});