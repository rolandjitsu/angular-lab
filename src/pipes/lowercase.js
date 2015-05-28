import { isString, StringWrapper } from 'angular2/src/facade/lang';
import { Pipe } from 'angular2/change_detection';

export class LowerCasePipe extends Pipe {
	_latestValue: string;
	constructor() {
		super();
		this._latestValue = null;
	}
	supports(str): boolean {
		return isString(str);
	}
	onDestroy(): void {
		this._latestValue = null;
	}
	transform(value: string): string {
		if (this._latestValue === value) return this._latestValue;
		else {
			this._latestValue = value;
			return StringWrapper.toLowerCase(value);
		}
	}
}

export class LowerCaseFactory {
	supports(str): boolean {
		return isString(str);
	}
	create(): Pipe {
		return new LowerCasePipe();
	}
}