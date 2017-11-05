import {Component} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';


@Component({
    selector: 'rj-reset',
    templateUrl: './reset.component.html',
    styleUrls: [
        './reset.component.scss'
    ]
})
export class ResetComponent {
    isResetting = false;
    credentials: Partial<Credentials> = {};

    constructor(private router: Router, private afAuth: AngularFireAuth, private snackBar: MatSnackBar) {}

    async resetPassword(): Promise<void> {
        const {email} = this.credentials;
        const snackBarConfig = {duration: 2500};
        if (email) {
            try {
                this.isResetting = true;
                const res = await this.afAuth.auth.sendPasswordResetEmail(email, {
                    url: `http://localhost/login/verify`,
                    handleCodeInApp: false
                });
                console.log(res);
                this.snackBar.open(`We've sent and email to ${email} with instructions.`, void 0, snackBarConfig);
                this.router.navigate(['../']);
            } catch (e) {
                console.log(e)
                this.snackBar.open(`${email} is not registered`, void 0, snackBarConfig);
                this.isResetting = false;
            }
        }
    }
}

interface Credentials {
    email: string;
}
