import { Home } from './components/home/home';
import { Todos } from './components/todos/todos';

export var routes: Array<any> = [
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