# Angular 2 Playground

> As Pawel describes in the original [ng2-play](https://github.com/pkozlowski-opensource/ng2-play) repo, this is a minimal setup of a ES6 project using Angular 2.0.

Besides things like the new [router](https://github.com/angular/router) and [components](https://angular.io/docs/js/latest/api/annotations/Directive-class.html) in Angular 2, ES6 usage with [Traceur](https://github.com/google/traceur-compiler) and [SystemJS](https://github.com/systemjs/systemjs) are also being illustrated.

#### Setup
----------

Clone this repo and setup the following tools on your machine:

- [Node](http://nodejs.org) - if not already installed (used for a variety of things: update/install project dependencies, etc.)
- [Direnv](http://direnv.net/) - exposes the necessary node binaries to the `PATH` in your shell (from `.envrc`) so that you do not have to install any deps globally (make sure to run `direnv allow` when navigating for the first time in the project folder)
- [Go](https://golang.org/doc/install) - runs a webserver locally

Once you have all tools setup install all node dependencies by running:

```shell
npm install
```

Now let's makes sure that our client deps are installed/updated:

```shell
bower update
```

Start the webserver by using:

```shell
go run server.go
```