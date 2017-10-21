import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';


/**
 * Feature modules
 */
import {CoreModule, PreloadSelectedModulesOnly} from './core';
import {AppRoutingModule} from './app-routing.module';

/**
 * Components
 */
import {AppComponent} from './app.component';
import {LayoutComponent} from './layout/layout.component';
import {HomeComponent} from './home/home.component';
import {ErrorComponent} from './error/error.component';


@NgModule({
    imports: [
        BrowserModule,
        CoreModule.forRoot(),
        AppRoutingModule
    ],
    providers: [PreloadSelectedModulesOnly],
    declarations: [
        AppComponent,
        ErrorComponent,
        LayoutComponent,
        HomeComponent
    ],
    // A list of components that can be bootstrapped.
    // Usually there is only one component in this list,
    // the root component of the application.
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {}
