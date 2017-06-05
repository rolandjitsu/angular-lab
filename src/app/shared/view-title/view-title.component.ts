import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {ViewTitleService} from './view-title.service';


@Component({
	selector: 'rj-view-title',
	templateUrl: './view-title.component.html'
})
export class ViewTitleComponent implements OnInit, OnDestroy {
	title: string;
	private sub: Subscription;

	constructor(private viewTitle: ViewTitleService) {}

	ngOnInit(): void {
		// Set title when it changes
		this.sub = this.viewTitle.title.subscribe(title => this.set(title));
	}
	ngOnDestroy(): void {
		this.sub.unsubscribe();
	}

	set(title: string): void {
		this.title = title;
	}
}
