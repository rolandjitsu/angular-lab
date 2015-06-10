import { Home } from 'app/components/home/home';
import { Todos } from 'app/components/todos/todos';

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