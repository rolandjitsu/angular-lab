import {Component, OnInit} from '@angular/core';

import {visible} from '../../shared/animations';


@Component({
	selector: 'rj-trends',
	templateUrl: './trends.component.html',
	styleUrls: [
		'./trends.component.scss'
	],
	animations: [
		visible
	]
})
export class TrendsComponent implements OnInit {
	ngOnInit(): void {

	}
}
