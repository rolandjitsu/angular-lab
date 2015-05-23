import { InjectAnnotation as Inject } from 'angular2/di';
import { ComponentAnnotation as Component, ViewAnnotation as View } from 'angular2/angular2';
import { RouteParams } from 'angular2/router';

@Component({
	selector: 'movie'
})

@View({
	templateUrl: 'components/movie/movie.html'
})

export class Movie {
	constructor(@Inject(RouteParams) params) {
		this.id = params.get('id');
		console.log("init movie", this.id);
	}
	canActivate() {
		console.log("can activate");
	}
}