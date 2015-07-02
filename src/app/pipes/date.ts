import { isString, isBlank, NumberWrapper, BaseException } from 'angular2/src/facade/lang';
import { Pipe, BasePipe, PipeFactory } from 'angular2/change_detection';

export class DateFactory implements PipeFactory {
	create(): Pipe {
		return new DatePipe();
	}
	supports(obj): boolean {
		return DatePipe.isFormatValid(obj);
	}
}

export class DatePipe extends BasePipe {
	static isFormatValid(obj): boolean {
		return (isString(obj) || !NumberWrapper.isNaN(obj)) && moment(obj).isValid();
	}
	transform(value: string, args: Array<any> = null): string {
		if (isBlank(args) || args.length == 0) throw new BaseException('date pipe requires one argument');
		let format: string = args[0];
		return moment(value).format(format);
	}
	supports(obj: any): boolean {
		return DatePipe.isFormatValid(obj);
	}
}