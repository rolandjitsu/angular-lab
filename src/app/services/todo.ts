import { Injectable } from 'angular2/angular2';
import { isString, isNumber } from 'common/facade';

import { FirebaseArray, FirebaseArrayValue, FIREBASE_TIMESTAMP } from 'common/firebase';

export interface Todo extends FirebaseArrayValue {
	createdAt: number | string;
	updatedAt: number | string;
	completed: boolean;
	desc: string;
}

export class TodoModel implements Todo {
	createdAt: number | string = FIREBASE_TIMESTAMP;
	updatedAt: number | string = FIREBASE_TIMESTAMP;
	completed: boolean = false;
	desc: string;
	key: string;
	constructor(desc?: string, completed?: boolean, key?: string, createdAt?: number | string, updatedAt?: number | string) {
		if (isString(desc)) this.desc = desc;
		if (completed !== undefined) this.completed = completed;
		if (isString(key)) this.key = key;
		if (isNumber(createdAt)) this.createdAt = createdAt;
		if (isNumber(updatedAt)) this.updatedAt = updatedAt;
	}
	static fromModel(model: Todo): TodoModel {
		return new TodoModel(model.desc, model.completed, model.key, model.createdAt, model.updatedAt);
	}
	static assign(model: Todo, ...sources: Todo[]): TodoModel {
		return TodoModel.fromModel(
			Object.assign.apply(null, [].concat([model], sources))
		);
	}
}

@Injectable()
export class TodoStore extends FirebaseArray {
	add(todo: Todo) {
		return super.add(todo);
	}
	update(record, data: Todo) {
		super.update(
			record.key,
			TodoModel.assign(<Todo>{}, record, data, <Todo>{
				updatedAt: FIREBASE_TIMESTAMP
			})
		);
	}
	remove(record) {
		super.remove(record.key);
	}
}