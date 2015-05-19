import { bootstrap } from 'angular2/core';
import { ComponentAnnotation as Component, ViewAnnotation as View } from 'angular2/angular2';
import { RouteConfigAnnotation as RouteConfig, RouterOutlet, RouterLink, routerInjectables } from 'angular2/router';
import { Home } from 'components/home/home';
import { List } from 'components/list/list';
import { Movie } from 'components/movie/movie';

@Component({
	selector: 'app'
})

@View({
	template: '<router-outlet></router-outlet>',
	directives: [
		RouterOutlet,
		RouterLink
	]
})

@RouteConfig([
	{
		path: '/',
		component: Home,
		as: 'index'
	},
	{
		path: '/movies',
		component: List,
		as: 'movies'
	},
	{
		path: '/movies/:id',
		component: Movie,
		as: 'movie'
	}
])

class App {}

bootstrap(App, [
	routerInjectables
]);