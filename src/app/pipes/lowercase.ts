import { Injectable, Pipe, PipeTransform } from 'angular2/angular2';

import { isBlank, isString } from 'common/facade';

@Pipe({ name: 'lowercase' })
@Injectable()
export class LowerCasePipe implements PipeTransform {
	transform(value: string, args: List<any> = null): string {
		if (isBlank(value)) return value;
		if (!isString(value)) {
			// throw new InvalidPipeArgumentException(LowerCasePipe, value);
		}
		return value.toLowerCase();
	}
}