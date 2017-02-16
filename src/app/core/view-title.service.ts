import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';


@Injectable()
export class ViewTitleService {
	// Observable string sources
	private titleSource: ReplaySubject<any> = new ReplaySubject();
	// Observable string streams
	title: Observable<any> = this.titleSource.asObservable(); // tslint:disable-line:member-ordering

	set(title: string): void {
		this.titleSource.next(title);
	}
}
