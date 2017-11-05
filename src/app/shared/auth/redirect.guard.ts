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
export class RedirectGuard implements CanActivate, CanActivateChild, CanLoad {
    constructor(private router: Router, private afAuth: AngularFireAuth) {}
    canLoad(): Promise<boolean> {
        return this.canActivate();
    }
    canActivateChild(): Promise<boolean> {
        return this.canActivate();
    }
    async canActivate(): Promise<boolean> {
        const user = await this.afAuth.authState.take(1)
            .toPromise();
        if (user) {
            // TODO: Track nav history and go back to last nav item, otherwise go to root
            this.router.navigate(['/']);
            return false;
        }
        return true;
    }
}
