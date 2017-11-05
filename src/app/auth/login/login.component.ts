import {Component} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {AngularFireAuth} from 'angularfire2/auth';
import {Credentials} from '../shared';


@Component({
    selector: 'rj-login',
    templateUrl: './login.component.html',
    styleUrls: [
        './login.component.scss'
    ]
})
export class LoginComponent {
    isAuthenticating = false;
    credentials: Partial<Credentials> = {};

    constructor(private afAuth: AngularFireAuth, private snackBar: MatSnackBar) {}

    async loginWithEmail(): Promise<void> {
        const {email, password} = this.credentials;
        if (email && password) {
            try {
                this.isAuthenticating = true;
                await this.afAuth.auth.signInWithEmailAndPassword(email, password);
            } catch {
                this.isAuthenticating = false;
                this.snackBar.open('Unable to login. Please check your credentials', void 0, {
                    duration: 2500
                });
            }
        }
    }
}
