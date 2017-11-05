import {Component, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MatSidenav} from '@angular/material';
import {AngularFireAuth} from 'angularfire2/auth';


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

    constructor(private router: Router, private afAuth: AngularFireAuth) {}

    navigate(link: any[]): void {
        this.sidenav.close()
            .then(() => this.router.navigate(link));
    }

    async logout(): Promise<void> {
        await this.afAuth.auth.signOut();
    }
}
