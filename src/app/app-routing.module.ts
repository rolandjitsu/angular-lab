import {NgModule} from '@angular/core';
import {ExtraOptions, RouterModule, Routes} from '@angular/router';

import {PreloadSelectedModulesOnly} from './core';
import {AuthGuard, RedirectGuard} from './shared';

import {ErrorComponent} from './error/error.component';
import {LayoutComponent} from './layout/layout.component';
import {HomeComponent} from './home/home.component';


// Check https://angular.io/docs/ts/latest/guide/router.html for more info about the Router and routing in general.
// For lazy loading check: http://angularjs.blogspot.ch/2016/08/angular-2-rc5-ngmodules-lazy-loading.html, https://github.com/angular/angular/pull/10705.
export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {path: '', component: HomeComponent, pathMatch: 'full'},
            {
                path: 'account',
                canLoad: [AuthGuard],
                loadChildren: 'app/account/account.module#AccountModule'
            }
        ]
    },
    {
        path: 'login',
        canLoad: [RedirectGuard],
        loadChildren: 'app/auth/auth.module#AuthModule',
        data: {preload: true}
    },
    {
        path: '**',
        component: ErrorComponent
    }
];

export const config: ExtraOptions = {
    preloadingStrategy: PreloadSelectedModulesOnly,
    useHash: true
};


@NgModule({
    imports: [
        RouterModule.forRoot(routes, config)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {}
