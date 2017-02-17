import {
	Component,
	ViewChild,
	OnInit,
	OnDestroy,
	Inject
} from '@angular/core';
import {Router} from '@angular/router';
import {MdSidenav} from '@angular/material';
import {ObservableMedia} from '@angular/flex-layout';
import {Subscription} from 'rxjs/Subscription';


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

	private subs: Subscription[] = [];

	constructor(private router: Router, @Inject(ObservableMedia) public media: any) {}

	ngOnInit(): void {
		// https://github.com/angular/flex-layout/wiki/Adaptive-Layouts
		this.subs.push(...[
			this.media.subscribe(() => {
				const isGtSm = this.media.isActive('gt-sm');
				this.showMenuButton = !isGtSm;

				if (isGtSm) {
					this.sidenav.open();
					this.mode = 'side';
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
		if (!this.media.isActive('gt-sm')) {
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
