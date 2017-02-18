import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {IScheduler} from 'rxjs/Scheduler';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/multicast';


@Injectable()
export class PoolingService {
	// NOTE: If we run unit tests, we need to use TestScheduler,
	// therefore, we provide an optional arg for using a different scheduler.
	execute<T>(operation: () => Observable<T>, frequency: number = 1000, scheduler?: IScheduler): Observable<T> {
		const interval = scheduler
			? Observable.interval(frequency, scheduler)
			: Observable.interval(frequency);
		return interval.mergeMap(operation)
			.multicast(() => new ReplaySubject())
			.refCount();
	}
}
