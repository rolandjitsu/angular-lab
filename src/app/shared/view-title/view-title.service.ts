import {
	Injectable,
	Optional,
	Provider,
	SkipSelf
} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';


@Injectable()
export class ViewTitleService {
	// Observable string sources
	private titleSource: ReplaySubject<string> = new ReplaySubject();
	// Observable string streams
	title: Observable<string> = this.titleSource.asObservable(); // tslint:disable-line: member-ordering

	set(title: string): void {
		this.titleSource.next(title);
	}
}


export function VIEW_TITLE_SERVICE_PROVIDER_FACTORY(parentFactory: ViewTitleService): ViewTitleService {
	return parentFactory || new ViewTitleService();
}

export const VIEW_TITLE_SERVICE_PROVIDER: Provider = {
	// If there is already a ViewTitleService available, use that.
	// Otherwise, provide a new one.
	provide: ViewTitleService,
	useFactory: VIEW_TITLE_SERVICE_PROVIDER_FACTORY,
	deps: [
		[new Optional(), new SkipSelf(), ViewTitleService]
	]
};
