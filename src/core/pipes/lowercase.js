import { isString } from 'angular2/src/facade/lang';
import { Pipe } from 'angular2/change_detection';

export class LowercasePipe extends Pipe {
	supports(obj):boolean {
		return isString(obj);
	}
	transform(value):string {
		return value.toLowerCase();
	}
	create():Pipe {
		return this;
	}
}