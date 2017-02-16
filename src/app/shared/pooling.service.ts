import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/mergeMap';


@Injectable()
export class PoolingService {
	execute<T>(operation: () => Observable<T>, frequency: number = 1000): Observable<T> {
		return Observable.interval(frequency)
			.mergeMap(operation);
	}
}
