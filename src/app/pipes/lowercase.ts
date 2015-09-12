import { Injectable, Pipe, PipeTransform } from 'angular2/angular2';

import { isBlank } from 'common/lang';

@Pipe({ name: 'lowercase' })
@Injectable()
export class LowerCasePipe implements PipeTransform {
	transform(value: string, args: any[] = null): string {
		if (isBlank(value)) return value;
		return value.toLowerCase();
	}
}