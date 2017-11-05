import {Component} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {AngularFireAuth} from 'angularfire2/auth';
import {User} from 'firebase/app';
import {Credentials} from '../shared';


@Component({
    selector: 'rj-register',
    templateUrl: './register.component.html',
    styleUrls: [
        './register.component.scss'
    ]
})
export class RegisterComponent {
    isRegistering = false;
    credentials: Partial<Credentials> = {};

    constructor(private afAuth: AngularFireAuth, private snackBar: MatSnackBar) {}

    async createUser(): Promise<void> {
        const {email, password} = this.credentials;
        const snackBarConfig = {duration: 2500};
        if (email && password) {
            try {
                this.isRegistering = true;
                // Register the user
                await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
                const user = this.afAuth.auth.currentUser as User;
                // Set the display name
                const [name] = email.split('@');
                await user.updateProfile({
                    displayName: `${name}`,
                    photoURL: null
                })
                this.snackBar.open(`You've successfuly register with ${email}.`, void 0, snackBarConfig);
            } catch {
                this.snackBar.open(`${email} may already exist`, void 0, snackBarConfig);
                this.isRegistering = false;
            }
        }
    }
}
