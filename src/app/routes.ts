import { Home } from './components/home/home';
import { Todos } from './components/todos/todos';

export interface IRoute<T> {
	component: T,
	path: string,
	as?: string
}

export var routes: Array<IRoute<any>> = [
	{
		component: Home,
		path: '/',
		as: 'home'
	},
	{
		component: Todos,
		path: '/todos',
		as: 'todos'
	}
]