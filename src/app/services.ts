import { bind } from 'angular2/angular2';

import { TodoStore } from './services/todo';
import { IconStore } from './services/icon';

export * from './services/animation';
export * from './services/icon';
export * from './services/todo';

export const serviceInjectables: Array<any> = [
	bind(TodoStore).toClass(TodoStore),
	bind(IconStore).toClass(IconStore)
];