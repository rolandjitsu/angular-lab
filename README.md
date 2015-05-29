# Angular 2 Playground
> As Pawel describes in the original [ng2-play](https://github.com/pkozlowski-opensource/ng2-play) repo, this is a minimal setup of a ES6 project using Angular 2.0.

Throughout the project, the following things are being illustrated:
- [Router](https://github.com/angular/router)
- [Components](https://angular.io/docs/js/latest/api/annotations/Component-class.html)
- [Forms](https://angular.io/docs/js/latest/api/forms/)
- [DI](https://angular.io/docs/js/latest/api/di_annotations/)
- [Pipes](https://angular.io/docs/js/latest/api/pipes/Pipe-class.html)

Moreover, you can find a very slim example of compiling ES6 with [Traceur](https://github.com/google/traceur-compiler) and using [SystemJS](https://github.com/systemjs/systemjs) together with [ES6 Module Loader](https://github.com/ModuleLoader/es6-module-loader) to load the compiled files.


#### Setup
----------
Clone this repo and setup the following tools on your machine:

- [Node](http://nodejs.org) - if not already installed (used for a variety of things: update/install project dependencies, start a webserver, etc.)
- [Gulp](http://gulpjs.com/) - this has to be installed globally (`npm install --global gulp`) unless already installed

Once you have the tools setup install all dependencies by running:

```shell
npm install
```

Now start the webserver and the build process:

```shell
gulp play
```


#### Learning Material
----------------------
- [Angular Docs](https://angular.io)
- [Futuristic routing in Angular](http://blog.thoughtram.io/angularjs/2015/02/19/futuristic-routing-in-angular.html)
- [Angular 2 Education](https://github.com/timjacobi/angular2-education)
- [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Shadow_DOM)
- ECMAScript (*Offical Strawman*) - [Types](http://wiki.ecmascript.org/doku.php?id=strawman:types&s=types)
- [Forms](https://ngforms.firebaseapp.com)
- [Dependency Injection in Angular 2](http://blog.thoughtram.io/angular/2015/05/18/dependency-injection-in-angular-2.html)
- [ES6 Features](https://github.com/lukehoban/es6features)


#### Credits
------------
In the making of this simple app, I have made use of whatever resources I could find out there (since the docs on some of the Angular 2 features usage is not that extensive and it's constantly changing for the moment), thus it's worth mentioning that the following projects have served as inspiration and help:

- [ng2-play](https://github.com/pkozlowski-opensource/ng2-play)
- [angular2-webpack-starter](https://github.com/angular-class/angular2-webpack-starter)
- [angular2-authentication-sample](https://github.com/auth0/angular2-authentication-sample)
- [ng2do](https://github.com/davideast/ng2do)