# Angular 2 Playground
[![Build Status](https://travis-ci.org/rolandjitsu/ng2-play.svg?branch=master)](https://travis-ci.org/rolandjitsu/ng2-play)
[![Dependency Status](https://gemnasium.com/rolandjitsu/ng2-play.svg)](https://gemnasium.com/rolandjitsu/ng2-play)
> Minimal setup of [ES6](https://github.com/lukehoban/es6features), [TypeScript](http://www.typescriptlang.org/), [Angular 2.0](https://angular.io/) and [Firebase](https://firebase.com).

All ES6 files are being compiled/transpiled with [TypeScript](http://www.typescriptlang.org/) (because most of the code is a combination of ES6 and TypeScript specific syntax) to ES5 and loaded in the browser using [SystemJS](https://github.com/systemjs/systemjs). Throughout the app, most of the features in Angular 2.0 are being used. Moreover, a fairly simple example of using [three-way](https://www.firebase.com/resources/images/blog/3-way-binding.png) data binding with Firebase written in ES6 (on top of the Firebase [JavaScript API](https://www.firebase.com/docs/web/)) is being illustrated.


#### Setup
----------
Clone this repo and setup the following tools on your machine:

- [Node](http://nodejs.org) (*if not already installed*)
- [Gulp](http://gulpjs.com/) (*optional*)

After you have the above tools setup, install all runtime/dev dependencies by running:

```shell
npm install
```

Now start the webserver and the build process (runs on file change) and navigate to [localhost:8000](http://localhost:8000):

```shell
npm start # `gulp play` if gulp is installed globally
```


#### Browser Support
--------------------
Even though all source code is compiled/transpiled to ES5 and [SystemJS](https://github.com/systemjs/systemjs) has support for IE8 and up, Angular 2.0 has no official indication of what browsers it supports.
Therefore, is safe to assume that only [evergreen](http://eisenbergeffect.bluespire.com/evergreen-browsers/) browsers are being supported for now.


#### Learning Material
----------------------
- [Angular Docs](https://angular.io)
- Angular 2 - [Routing](http://blog.thoughtram.io/angularjs/2015/02/19/futuristic-routing-in-angular.html)
- Angular 2 - [Template Syntax](http://victorsavkin.com/post/119943127151/angular-2-template-syntax)
- Angular 2 - [Forms](https://ngforms.firebaseapp.com)
- ECMAScript (*Offical Strawman*) - [Types](http://wiki.ecmascript.org/doku.php?id=strawman:types&s=types)
- Firebase - [Synchronized Arrays](https://www.firebase.com/blog/2014-05-06-synchronized-arrays.html)
- Traceur - [ES6 Language Features](https://github.com/google/traceur-compiler/wiki/LanguageFeatures)
- [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Shadow_DOM)
- [Angular 2 Education](https://github.com/timjacobi/angular2-education)
- [Dependency Injection in Angular 2](http://blog.thoughtram.io/angular/2015/05/18/dependency-injection-in-angular-2.html)


#### Credits
------------
In the making of this simple app, I have made use of whatever resources I could find out there (since the docs on some of the Angular 2 features usage are not that extensive and it's constantly changing for the moment), thus it's worth mentioning that the following projects have served as inspiration and help:

- [ng2-play](https://github.com/pkozlowski-opensource/ng2-play)
- [angular2-webpack-starter](https://github.com/angular-class/angular2-webpack-starter)
- [angular2-authentication-sample](https://github.com/auth0/angular2-authentication-sample)
- [ng2do](https://github.com/davideast/ng2do)