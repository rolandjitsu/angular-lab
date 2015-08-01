import { Injectable } from 'angular2/angular2';

import { FirebaseArray, IFirebaseArrayValue, FIREBASE_TIMESTAMP } from 'common/firebase';

export interface ITodo extends IFirebaseArrayValue {
	createdAt: string;
	updatedAt: string;
	completed: boolean;
	desc: string;
}

class Todo implements ITodo {
	createdAt: string = FIREBASE_TIMESTAMP;
	updatedAt: string = FIREBASE_TIMESTAMP;
	completed: boolean = false;
	desc: string;
	key: string;
	constructor(desc: string) {
		this.desc = desc;
	}
}

@Injectable()
export class TodoStore extends FirebaseArray {
	add(task: string) {
		return super.add(
			new Todo(task)
		);
	}
	update(record, data) {
		super.update(
			record.key,
			Object.assign({}, record, data, {
				updatedAt: FIREBASE_TIMESTAMP
			})
		);
	}
	remove(record) {
		super.remove(record.key);
	}
}