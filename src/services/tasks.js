import { bind, Injectable } from 'angular2/di';
import { Inject, InjectPromise, InjectLazy, Optional } from 'angular2/src/di/decorators';

class TasksStore {
	constructor () {
		this.tasks = [];
	}
};

export const tasksInjectables = [
	bind(TasksStore).toClass(TasksStore)
];

export class TasksService {
	constructor(store: TasksStore) {
		this.store = store;
	}
	get(idx) {
		return isNaN(idx) ? this.store.tasks : this.store.tasks[idx];
	}
	add(task) {
		this.store.tasks.push({
			value: task,
			timestamp: Date.now()
		});
	}
	remove(idx) {
		this.store.tasks.splice(idx, 1);
	}
}