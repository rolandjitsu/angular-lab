import {Pipe, PipeTransform} from 'angular2/core';

import {isBlank} from '../../common/lang';

@Pipe({name: 'lowercase'})
export class LowerCasePipe implements PipeTransform {
	transform(value: string, args: any[] = null): string {
		if (isBlank(value)) return value;
		return value.toLowerCase();
	}
}