import {Component} from '@angular/core';
import {ViewTitleService} from '../core';


@Component({
	selector: 'rj-iss',
	templateUrl: './iss.component.html',
	styleUrls: [
		'./iss.component.scss'
	]
})
export class IssComponent {
	constructor(viewTitle: ViewTitleService) {
		viewTitle.set('ISS');
	}
}
