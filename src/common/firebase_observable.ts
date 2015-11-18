import { Observable } from 'angular2/angular2';

export enum FirebaseEventType {
	Value,
	ChildAdded,
	ChildChanged,
	ChildRemoved,
	ChildMoved
}

const FIREBASE_EVENT_TYPE = {
	[FirebaseEventType.Value]: 'value',
	[FirebaseEventType.ChildAdded]: 'child_added',
	[FirebaseEventType.ChildChanged]: 'child_changed',
	[FirebaseEventType.ChildMoved]: 'child_moved',
	[FirebaseEventType.ChildRemoved]: 'child_removed'
};

export interface FirebaseEvent {
	data: FirebaseDataSnapshot;
	type: FirebaseEventType;
}

export class FirebaseObservable extends Observable<FirebaseEvent> {
	private _path: string;
	private _events: FirebaseEventType[];

	constructor(path: string | Firebase | FirebaseQuery, events: FirebaseEventType[]) {
		super((observer) => {
			let map = [];
			let firebaseRef: Firebase | FirebaseQuery = path instanceof Firebase || typeof path === 'object' ? path : new Firebase(`${path}`);
			for (var event of events) {
				event = FIREBASE_EVENT_TYPE[event];
				map.push([event, function (snapshot: FirebaseDataSnapshot) {
					observer.next(<FirebaseEvent>{
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
		const observable = new FirebaseObservable(this._path, this._events);
		observable.source = this;
		observable.operator = operator;
		return observable;
	}
}