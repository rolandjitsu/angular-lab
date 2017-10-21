import {Component, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MatSidenav} from '@angular/material';


@Component({
    selector: 'rj-layout',
    templateUrl: './layout.component.html',
    styleUrls: [
        './layout.component.scss'
    ]
})
export class LayoutComponent {
    @ViewChild('sidenav') sidenav: MatSidenav;
    mode = 'push';

    constructor(private router: Router) {}

    navigate(link: any[]): void {
        this.sidenav.close()
            .then(() => this.router.navigate(link));
    }
}
