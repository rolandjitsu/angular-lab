import { Home } from 'components/home/home';
import { Tasks } from 'components/tasks/tasks';

export var routes = [
	{
		component: Home,
		path: '/',
		as: 'home'
	},
	{
		component: Tasks,
		path: '/tasks',
		as: 'tasks'
	}
]