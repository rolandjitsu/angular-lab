import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/multicast';


@Injectable()
export class PoolingService {
	// NOTE: Running the interval outside Angular ensures that e2e tests will not hang.
	execute<T>(operation: () => Observable<T>, frequency: number = 1000): Observable<T> {
		return Observable.interval(frequency)
			.mergeMap(operation)
			.multicast(() => new ReplaySubject())
			.refCount();
	}
}
