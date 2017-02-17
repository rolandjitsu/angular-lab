import {Injectable, NgZone} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/multicast';


@Injectable()
export class PoolingService {
	constructor(private zone: NgZone) {}

	// NOTE: Running the interval outside Angular ensures that e2e tests will not hang.
	execute<T>(operation: () => Observable<T>, frequency: number = 1000): Observable<T> {
		const subject = new Subject();
		const source = Observable.create((observer: Observer<T>) => {
			let sub: Subscription;
			this.zone.runOutsideAngular(() => {
				const zone = this.zone;
				sub = Observable.interval(frequency)
					.mergeMap(operation)
					.subscribe({
						next(result) {
							zone.run(() => {
								observer.next(result);
							});
						},
						error(err) {
							zone.run(() => {
								observer.error(err);
							});
						}
					});
			});

			return () => {
				if (sub) {
					sub.unsubscribe();
				}
			};
		});


		return source.multicast(subject)
			.refCount();
	}
}
