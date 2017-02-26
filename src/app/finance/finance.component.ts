import {Component} from '@angular/core';
import {ViewTitleService} from '../core';


@Component({
	selector: 'rj-finance',
	templateUrl: './finance.component.html',
	styleUrls: [
		'./finance.component.scss'
	]
})
export class FinanceComponent {
	constructor(viewTitle: ViewTitleService) {
		viewTitle.set('Finance');
	}
}
