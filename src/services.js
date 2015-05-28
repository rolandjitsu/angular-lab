import { bind } from 'angular2/di';
import { TasksStore } from 'services/chores';

export { Chores } from 'services/chores';

export const serviceInjectables = [
	bind(TasksStore).toClass(TasksStore)
];