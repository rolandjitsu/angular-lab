import {Injectable} from '@angular/core';
import {
    CanActivate,
    CanActivateChild,
    CanLoad,
    Router
} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';

import 'rxjs/add/operator/take';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
    constructor(private router: Router, private afAuth: AngularFireAuth) {}

    canActivateChild(): Promise<boolean> {
        return this.canActivate();
    }
    canLoad(): Promise<boolean> {
        return this.canActivate();
    }

    async canActivate(): Promise<boolean> {
        const user = await this.afAuth.authState.take(1)
            .toPromise();
        if (user) {
            return true;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }
}
