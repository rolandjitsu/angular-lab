import * as Firebase from 'firebase';

import { isString, isNumber } from 'common/lang';
import { FirebaseArray, FirebaseArrayValue } from 'common/firebase';

export interface Todo extends FirebaseArrayValue {
	createdAt: number | string;
	updatedAt: number | string;
	completed: boolean;
	desc: string;
}

export class TodoModel implements Todo {
	createdAt: number | string = Firebase.ServerValue.TIMESTAMP;
	updatedAt: number | string = Firebase.ServerValue.TIMESTAMP;
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

export class TodoStore extends FirebaseArray {
	add(todo: Todo): Promise<Firebase> {
		return super.add(todo);
	}
	update(record, data: Todo): Promise<Firebase> {
		return super.update(
			record.key,
			TodoModel.assign(<Todo>{}, record, data, <Todo>{
				updatedAt: Firebase.ServerValue.TIMESTAMP
			})
		);
	}
	remove(record): Promise<any> {
		return super.remove(record.key);
	}
}