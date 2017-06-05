import {
	Component,
	OnDestroy,
	OnInit,
	ViewChild
} from '@angular/core';
import {ObservableMedia} from '@angular/flex-layout';
import {Router} from '@angular/router';
import {MdSidenav} from '@angular/material';

import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {async} from 'rxjs/scheduler/async';
import 'rxjs/add/operator/map';


@Component({
	selector: 'rj-layout',
	templateUrl: './layout.component.html',
	styleUrls: [
		'./layout.component.scss'
	]
})
export class LayoutComponent implements OnInit, OnDestroy {
	@ViewChild('sidenav') sidenav: MdSidenav;

	mode = 'side';
	showMenuButton = false;

	private isMenuVisibleSource: BehaviorSubject<boolean> = new BehaviorSubject(false);
	isMenuVisible: Observable<boolean> = this.isMenuVisibleSource.asObservable(); // tslint:disable-line: member-ordering

	private subs: Subscription[] = [];

	constructor(private router: Router, private media: ObservableMedia) {
		this.media.subscribe(() => {
			async.schedule(() => {
				const isGtSm = this.media.isActive('gt-sm');
				this.isMenuVisibleSource.next(isGtSm);
			}, 150);
		});
	}

	ngOnInit(): void {
		this.subs.push(...[
			// https://github.com/angular/flex-layout/wiki/Adaptive-Layouts
			this.isMenuVisible.subscribe(isMenuVisible => {
				this.showMenuButton = !isMenuVisible;
				if (isMenuVisible) {
					this.mode = 'side';
					this.sidenav.open();
				} else {
					this.sidenav.close()
						.then(() => {
							this.mode = 'over';
						});
				}
			})
		]);
	}
	ngOnDestroy(): void {
		for (const sub of this.subs) {
			sub.unsubscribe();
		}
	}

	navigate(link: any[]): void {
		if (!this.isMenuVisibleSource.getValue()) {
			this.sidenav.close()
				.then(() => this.router.navigate(link));
		} else {
			this.router.navigate(link);
		}
	}

	toggleSidenav(): void {
		this.sidenav.toggle();
	}
}
