import { InjectAnnotation as Inject } from 'angular2/di';
import { ComponentAnnotation as Component, ViewAnnotation as View } from 'angular2/angular2';
import { RouteConfigAnnotation as RouteConfig, Router, RouterOutlet, RouterLink } from 'angular2/router';
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
		RouterLink,
		Home
	]
})

@RouteConfig([
	{
		path: '/',
		component: Home,
		as: 'home'
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

export class App {
	constructor(@Inject(Router) router) {}
}