# Angular 2 Playground
[![Build Status](https://travis-ci.org/rolandjitsu/ng2-play.svg?branch=master)](https://travis-ci.org/rolandjitsu/ng2-play)
[![Dependency Status](https://gemnasium.com/rolandjitsu/ng2-play.svg)](https://gemnasium.com/rolandjitsu/ng2-play)
> Minimal setup of [Angular 2.0](https://angular.io/), [TypeScript](http://www.typescriptlang.org/), [ES6](https://github.com/lukehoban/es6features) and [Firebase](https://firebase.com).

All ES6 files are being compiled with [TypeScript](http://www.typescriptlang.org/) (because most of the code is a combination of ES6 and TypeScript specific syntax) and loaded in the browser using [SystemJS](https://github.com/systemjs/systemjs). Source maps are also generated for both the app source code and Angular 2 (makes it very easy to debug the app).


#### Setup
----------
Clone this repo and setup the following tools on your machine:

- [Node](http://nodejs.org) - if not already installed (used for a variety of things: update/install project dependencies, start a webserver, etc.)
- [Gulp](http://gulpjs.com/) - optional

Once you have the tools setup install all dependencies by running:

```shell
npm install
```

Now start the webserver (available at `localhost:8000`) and the build process (runs on file change):

```shell
npm start # `gulp play` if gulp is installed globally
```


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
In the making of this simple app, I have made use of whatever resources I could find out there (since the docs on some of the Angular 2 features usage is not that extensive and it's constantly changing for the moment), thus it's worth mentioning that the following projects have served as inspiration and help:

- [ng2-play](https://github.com/pkozlowski-opensource/ng2-play)
- [angular2-webpack-starter](https://github.com/angular-class/angular2-webpack-starter)
- [angular2-authentication-sample](https://github.com/auth0/angular2-authentication-sample)
- [ng2do](https://github.com/davideast/ng2do)