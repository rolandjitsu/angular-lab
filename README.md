# Angular 2 Playground
> As Pawel describes in the original [ng2-play](https://github.com/pkozlowski-opensource/ng2-play) repo, this is a minimal setup of a ES6 project using Angular 2.0.

Besides things like the new [router](https://github.com/angular/router) and [components](https://angular.io/docs/js/latest/api/annotations/Directive-class.html) in Angular 2, ES6 usage with [Traceur](https://github.com/google/traceur-compiler) and [SystemJS](https://github.com/systemjs/systemjs) are also being illustrated.


#### Setup
----------
Clone this repo and setup the following tools on your machine:

- [Node](http://nodejs.org) - if not already installed (used for a variety of things: update/install project dependencies, start a webserver, etc.)
- [Direnv](http://direnv.net/) - exposes the necessary node binaries to the `PATH` in your shell (from `.envrc`) so that you do not have to install any deps globally (make sure to run `direnv allow` when navigating for the first time in the project folder)
- [Gulp](http://gulpjs.com/) - if you choose not to use [Direnv](http://direnv.net/), this has to be installed globally unless already installed

Once you have the tools setup install all dependencies by running:

```shell
npm install
```

Now start the webserver and the build process:

```shell
gulp play
```


#### Credits
------------
In the making of this simple app, I have made use of whatever resources I could find out there (since the docs on some of the Angular 2 features usage is not that extensive and it's constantly changing for the moment), thus it's worth mentioning that the following projects have served as inspiration and help:

- [ng2-play](https://github.com/pkozlowski-opensource/ng2-play)
- [angular2-webpack-starter](https://github.com/angular-class/angular2-webpack-starter)
- [angular2-authentication-sample](https://github.com/auth0/angular2-authentication-sample)
- [ng2do](https://github.com/davideast/ng2do)