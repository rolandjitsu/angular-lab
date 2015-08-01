import { isString, StringWrapper } from 'angular2/src/facade/lang';
import { ChangeDetectorRef, Pipe, BasePipe, PipeFactory } from 'angular2/angular2';

export class LowerCaseFactory implements PipeFactory {
	create(): Pipe {
		return new LowerCasePipe();
	}
	supports(str): boolean {
		return isString(str);
	}
}

export class LowerCasePipe extends BasePipe implements PipeFactory {
	transform(value: string): string {
		return StringWrapper.toLowerCase(value);
	}
	supports(str): boolean {
		return isString(str);
	}
	create(cdRef: ChangeDetectorRef): Pipe {
		return this;
	}
}