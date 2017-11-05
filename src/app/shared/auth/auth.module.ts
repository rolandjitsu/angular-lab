import {NgModule} from '@angular/core';
import {AngularFireAuthModule} from 'angularfire2/auth';

import {AuthGuard} from './auth.guard';
import {RedirectGuard} from './redirect.guard';
import {IfAuthDirective} from './if-auth.directive';
import {UnlessAuthDirective} from './unless-auth.directive';

const directives = [
    IfAuthDirective,
    UnlessAuthDirective
];


@NgModule({
    declarations: [...directives],
    exports: [...directives],
    imports: [AngularFireAuthModule],
    providers: [
        AuthGuard,
        RedirectGuard
    ]
})
export class AuthModule {}
