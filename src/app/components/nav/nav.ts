import { Component, View } from 'angular2/angular2';
import { NgFor, NgIf } from 'angular2/directives';
import { RouterLink, Router } from 'angular2/router';

@Component({
	selector: 'nav',
	properties: [
		'routes'
	]
})

@View({
	templateUrl: 'app/components/nav/nav.html',
	directives: [
		NgFor,
		NgIf,
		RouterLink
	]
})

export class Nav {
	active: string;
	constructor(router: Router) {
		router.subscribe(path => this.active = path.indexOf('/') === -1 ? '/' : path);
	}
}