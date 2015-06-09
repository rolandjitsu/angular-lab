import { isString, StringWrapper } from 'angular2/src/facade/lang';
import { Pipe } from 'angular2/angular2';

export class LowerCasePipe extends Pipe {
	constructor() {
		super();
	}
	transform(value: string): string {
		return StringWrapper.toLowerCase(value);
	}
	supports(str): boolean {
		return isString(str);
	}
}

export class LowerCaseFactory {
	create(): Pipe {
		return new LowerCasePipe();
	}
	supports(str): boolean {
		return isString(str);
	}
}