import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {AngularFireAuth} from 'angularfire2/auth';
import 'rxjs/add/operator/skip';

@Component({
    selector: 'rj-lab',
    templateUrl: './app.component.html',
    styleUrls: [
        './app.component.scss'
    ]
})
export class AppComponent implements OnInit {
    constructor(private router: Router, private location: Location, private afAuth: AngularFireAuth) {}
    ngOnInit(): void {
        // const protectedRoutes = [
        //     !/^\/login/,
        //     !/^\/account/
        // ];
        this.afAuth.authState.skip(1)
            .subscribe(user => {
                if (user) {
                    // TODO: Navigate to prev. item in nav. history, otherwise to root
                    this.router.navigate(['/']);
                } else {
                    // TODO: Let's allow user to nav to any page besides the admin (or whatever we choose to protect)
                    const url = this.location.path();
                    if (!/^\/login/.test(url)) {
                        this.router.navigate(['/login']);
                    }
                }
            });
    }
}
