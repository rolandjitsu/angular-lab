# Angular 2 Laboratory

[![Build Status](https://travis-ci.org/rolandjitsu/ng2-lab.svg?branch=master)](https://travis-ci.org/rolandjitsu/ng2-lab)
[![Dependency Status](https://gemnasium.com/rolandjitsu/ng2-lab.svg)](https://gemnasium.com/rolandjitsu/ng2-lab)
[![Join the chat at https://gitter.im/rolandjitsu/ng2-lab](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/rolandjitsu/ng2-lab?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
> Playground for experimenting with some of the core features of [Angular 2.0](https://angular.io) and integration with other software and services.

This setup is using:
- [TypeScript](http://www.typescriptlang.org)
- [ES6 Shim](https://github.com/paulmillr/es6-shim) - necessary for browsers that haven't implemented any or some of the [ES6](http://es6-features.org) features
- [SystemJS](https://github.com/systemjs/systemjs) - loading the compiled (`.ts` -> `.js`) source files in the browser
- [Firebase](https://firebase.com) - realtime store for the app's data, authentication and hosting provider
- [Karma](http://karma-runner.github.io)
- [Jasmine](http://jasmine.github.io) - assertion lib for the app unit tests
- [Protractor](https://angular.github.io/protractor) - e2e test framework
- [Travis CI](https://travis-ci.org) - used as both continuous integration and delivery service for the app
- [Saucelabs](https://saucelabs.com) - browser provider for running the app tests on the CI server


#### Setup
----------
Clone this repo and setup the following tools on your machine:

- [Node](http://nodejs.org) (*if not already installed*)
- [Gulp](http://gulpjs.com/) (*optional*)

After you have the above tools setup, install all runtime/dev dependencies by running:

```shell
$(node bin)/npm install
```

Now start the webserver and the build process (runs on file change) and navigate to [localhost:3000](http://localhost:3000):

```shell
$(npm bin)/npm start # `$(npm bin)/gulp start`
```


#### Firebase Setup
-------------------
If you wish to have your own Firebase account used with this setup you have to change the `ROOT_FIREBASE_REF` located in `src/app/services.ts` to your own Firebase app link:

![Firebase App Link](media/firebase_app_link.png)

Furthermore, the authentication implementation uses Firebase as well, so you will have to make sure that **Email & Password** authentication is enabled from the **Login & Auth** tab in your app's Firebase dashboard:

![Firebase App Link](media/firebase_auth_tab.png)

Finally, if you want to use Firebase's [hosting](https://www.firebase.com/docs/hosting/quickstart.html) service, then you also have to change the `"firebase": "ng2-lab"` value from `firebase.json` to the name of you Firebase app.


#### Running Tests
------------------
A full test suite can be run using `gulp test`, which runs unit tests and lints all `.ts` files. Tests can also be run selectively, if preferred, as it follows:
- `$(npm bin)/gulp test:unit`: unit tests in a browser; runs in watch mode (i.e. watches the source files for changes and re-runs tests when files are updated)
- `$(npm bin)/gulp lint`: runs [tslint](http://palantir.github.io/tslint/) and checks all `.ts` files according to the `tslint.json` rules file
- `$(npm bin)/gulp test:unit/single`: unit tests in a browser; runs in single run mode, meaning it will run once and it will not watch for file changes

**Note**: When running the app (`$(npm bin)/gulp start`) in a terminal window and running the unit tests (`$(npm bin)/gulp test:unit`) in watch mode in another at the same time (or vice versa), two web socket servers will be started in the background in order to communicate between the two processes so that when the app builds on file change the unit tests won't build again (the unit tests task must bulid the `.ts` files in order to run the tests). Therefore, make sure port `1729` and port `6174` are not used by any other process.


#### Browser Support
--------------------
Even though all source code is compiled/transpiled to ES5 and [SystemJS](https://github.com/systemjs/systemjs) has support for IE8 and up, Angular 2.0 has no official indication of what browsers it supports.
Therefore, is safe to assume that only [evergreen](http://eisenbergeffect.bluespire.com/evergreen-browsers/) browsers are being supported for now.


#### Learning Material
----------------------
- [Angular Docs](https://angular.io)
- [Routing](http://blog.thoughtram.io/angularjs/2015/02/19/futuristic-routing-in-angular.html)
- [Template Syntax](http://victorsavkin.com/post/119943127151/angular-2-template-syntax)
- [Forms](https://ngforms.firebaseapp.com)
- [DI](http://blog.thoughtram.io/angular/2015/05/18/dependency-injection-in-angular-2.html)
- [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Shadow_DOM)
- [Angular 2 Education](https://github.com/timjacobi/angular2-education)
- [Awsome Angular 2](https://github.com/angular-class/awesome-angular2)


#### Credits
------------
In the making of this simple app, I have made use of whatever resources I could find out there (since the docs on some of the Angular 2 features usage are not that extensive and it's constantly changing for the moment), thus it's worth mentioning that the following projects have served as inspiration and help:

- [ng2-play](https://github.com/pkozlowski-opensource/ng2-play)
- [angular2-webpack-starter](https://github.com/angular-class/angular2-webpack-starter)
- [angular2-authentication-sample](https://github.com/auth0/angular2-authentication-sample)
- [ng2do](https://github.com/davideast/ng2do)


#### TODO/Roadmap
-----------------
- [ ] Fix Todos Rendering/Change Detection
- [x] Document Firebase Setup
- [ ] Todos Priority
- [ ] Document Travis CI Setup (Saucelabs, Firebase)
- [x] Basic Authentication
- [ ] OAuth Authentication (Google, Github)
- [ ] User Account/Dashboard
- [ ] Using Change Detection ([#4746](https://github.com/angular/angular/issues/4746))
- [ ] Fix Unit Tests
- [x] Use `injectAsync` ([#4715](https://github.com/angular/angular/issues/4715))
- [ ] E2E Tests
- [ ] Performance Tests
- [ ] Use [Fakes](https://www.youtube.com/watch?v=CbmPe0FTmcY)
- [x] Saas/Less
- [ ] Cleanup Gulpfile
- [ ] Fix TSLint Error ([#36](https://github.com/panuhorsmalahti/gulp-tslint/issues/36)) 
