import {Observable} from 'rxjs/Observable';
import * as Firebase from 'firebase';

export enum FirebaseQueryEventType {
	Value,
	ChildAdded,
	ChildChanged,
	ChildRemoved,
	ChildMoved
}

const FIREBASE_QUERY_EVENT_TYPE_PROPERTY = {
	[FirebaseQueryEventType.Value]: 'value',
	[FirebaseQueryEventType.ChildAdded]: 'child_added',
	[FirebaseQueryEventType.ChildChanged]: 'child_changed',
	[FirebaseQueryEventType.ChildMoved]: 'child_moved',
	[FirebaseQueryEventType.ChildRemoved]: 'child_removed'
};

export interface FirebaseQueryEvent {
	data: FirebaseDataSnapshot;
	type: FirebaseQueryEventType;
}

export class FirebaseQueryObservable extends Observable<FirebaseQueryEvent> {
	private _path: string;
	private _events: FirebaseQueryEventType[];

	constructor(path: string | Firebase | FirebaseQuery, events: FirebaseQueryEventType[]) {
		super((observer) => {
			let map = [];
			let firebaseRef: Firebase | FirebaseQuery = path instanceof Firebase || typeof path === 'object' ? path : new Firebase(`${path}`);
			for (var event of events) {
				event = FIREBASE_QUERY_EVENT_TYPE_PROPERTY[event];
				map.push([event, function (snapshot: FirebaseDataSnapshot) {
					observer.next(<FirebaseQueryEvent>{
						data: snapshot,
						type: event
					});
				}]);
			}
			for (let item of map) {
				firebaseRef.on(item[0], item[1]);
			}
			return () => {
				for (let item of map) {
					firebaseRef.off(item[0], item[1]);
				}
			};
		});
	}

	// https://github.com/ReactiveX/RxJS/blob/master/doc/operator-creation.md#adding-the-operator-to-observable
	lift(operator) {
		const observable = new FirebaseQueryObservable(this._path, this._events);
		observable.source = this;
		observable.operator = operator;
		return observable;
	}
}