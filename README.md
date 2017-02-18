# Angular Lab

[![Build Status](https://img.shields.io/travis/rolandjitsu/angular-lab.svg?style=flat-square)](https://travis-ci.org/rolandjitsu/angular-lab)
[![Dependency Status](https://david-dm.org/rolandjitsu/angular-lab.svg?style=flat-square)](https://github.com/rolandjitsu/angular-lab)
[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg?style=flat-square)](https://gitter.im/rolandjitsu/angular-lab)
> Playground for experimenting with some of the core features of [Angular](https://angular.io) and integration with other software and services.

This setup is using:
* [Core JS](https://github.com/zloirock/core-js) - necessary for browsers that haven't implemented any or some of the [ES6](http://es6-features.org) features required by Angular
* [HammerJS](http://hammerjs.github.io) - adds support for touch gestures in Material 2
* [TypeScript](http://www.typescriptlang.org)
* [Angular](http://angular.io)
* [Angular Flex Layout](https://github.com/angular/flex-layout)
* [Material 2](https://material.angular.io)

PaaS:
* [Firebase](https://firebase.com) - realtime store for the app's data, authentication and hosting provider

Unit/E2E tests:
* [Protractor](https://angular.github.io/protractor) - e2e test framework
* [Karma](http://karma-runner.github.io) - test runner for the app unit tests
* [Jasmine](http://jasmine.github.io) - assertion lib

CI/CD:
* [Saucelabs](https://saucelabs.com) - browser provider for running tests on the CI server
* [Travis CI](https://travis-ci.org) - CI/CD

Tools:
* [Angular CLI](https://cli.angular.io)

Package management:
* [Gemnasium](https://gemnasium.com) - keeps an eye on all the project dependencies versions
* [Yarn](https://yarnpkg.com/en)


# Table of Contents

* [Setup](#setup)
	* [Firebase](#firebase)
		* [Hosting](#hosting)
	* [Travis CI](#travis-ci)
* [Development](#development)
	* [Info](#info)
	* [Run Tests](#run-tests)
	* [Angular CLI](#angular-cli)
* [Deployments](#deployments)
* [Learning Material](#learning-material)
* [Browser Support](#browser-support)
* [Contribute](#contribute)
* [Credits](#credits)


### Setup
---------
Make sure you have [Node](http://nodejs.org) version `v7` (or above) installed.

If you'd like to use [Yarn](https://yarnpkg.com/en), follow their [instructions](https://yarnpkg.com/en/docs/install) to install it on your platform,
otherwise make sure at least [NPM 3](https://docs.npmjs.com/getting-started/installing-node#updating-npm) is installed, you can check the version with `npm --version`.

Follow the instructions for setting up the app:

1. Clone the repository: `git clone https://github.com/rolandjitsu/angular-lab.git`;
2. From the root of the project, install dependencies: `yarn`/`npm install`; 

**NOTE**: Keep in mind that every package that was installed has to be invoked with either `$(npm bin)/<package>` or `node_modules/.bin/<package>`.
Or if you want to avoid writing all of that every time:

1. Install [direnv](http://direnv.net);
2. Setup `.envrc` (just a file) with `export PATH=$PATH:$PWD/node_modules/.bin`;
3. Run `direnv allow` at the root of the project where `.envrc` resides.

Now you can simply run `<package>`.


#### Firebase
##### Hosting

If you want to use your own Firebase account for [hosting](https://firebase.google.com/docs/hosting/quickstart), then you have to do a few things in order to make it work.

First make sure that you have ran `$(node bin)/npm install` so that the [firebase-tools](https://github.com/firebase/firebase-tools) dependency is installed. Run the following command to get an auth token (follow the steps you are given by the command):

```shell
$(npm bin)/firebase login:ci
```

Copy the token and put it somewhere safe for further usage.

Also change the `"default": "firebase-ng2-lab"` property from `.firebaserc` to the name of you Firebase app.

Now you can deploy the app to you own Firebase by running:

```shell
$(npm bin)/gulp deploy --token <your firebase token>
```

**Note**: If you use tools like [direnv](http://direnv.net/) you can export a `FIREBASE_TOKEN` which will be picked up by the `$(npm bin)/gulp deploy` so you won't need to provide the `--token` option every time you run the command.

Also, you need to build the app using `$(npm bin)/gulp build` before any deployments if there were changes to the code and it has not been build yet.

#### Travis CI
If you plan on using this setup with your own projects and you wish to setup Travis CI,
then you must make sure of a few of things in order to have everything working properly on the CI:

1. Setup and env variable `FIREBASE_TOKEN` containing the token you got from `$(npm bin)/firebase login:ci` so that your deployments to firebase will work. If you do not use Firebase, skip this step. You may want to encrypt the token if the source code is public, use the Travis [docs](https://docs.travis-ci.com/user/environment-variables/#Encrypted-Variables) to see how to do it;
2. In case you use SauceLabs, see these [instructions](https://docs.travis-ci.com/user/sauce-connect) and replace the appropriate things in `.travis.yml`;
3. If you do not use the deployment to Firebase, remove that step from `.travis.yml`.

Now, keep in mind that cloning this repo and continuing in the same project will give you some issues with Travis if you setup your own account.
So I suggest you start out with a clean project and start git from scratch (`git init`),
then copy over things from this project (obviously, do not include `.git` - not visible on most UNIX base systems).


### Development
---------------
All you need to get started is `npm start` (or `npm start:staging`/`npm start:prod` if you need a different environment).
Now you should see the app running in the browser.

Below you can find a few of things to help understand how this setup works and how to make it easier when developing on this app.

#### Info
[Angular CLI](https://cli.angular.io) is used to handle every aspect of the development of the app (e.g. building, testing, etc.).
To get started, `npm start` will start a static webserver, rerun builds on file changes (styles, scripts, etc.), and reload the browser after builds are done.

Unit tests run the same way, whenever there is a change the tests will rerun on the new code. For further info about tests read below.

#### Run Tests
Tests can be run selectively as it follows:

* `npm run lint`/`$(npm bin)/ng lint`: runs [tslint](http://palantir.github.io/tslint) and checks all `.ts` files according to the `tslint.json` rules file;
* `$(npm bin)/ng test`: unit tests in a browser; runs in watch mode (i.e. watches the source files for changes and re-runs tests when files are updated);
* `npm run test`/`$(npm bin)/ng test --single-run`: unit tests in a browser; runs in single run mode, meaning it will run once and it will not watch for file changes;
* `npm run test:ci`: unit tests on the CI server; same as `npm run test`, but it runs on [Saucelabs](https://saucelabs.com) browsers;
* `npm run e2e`/`$(npm bin)/ng e2e`: e2e tests in Chrome (the latter command needs `npm run wd:update` to be run beforehand);
* `npm run e2e:ci`: e2e tests on the CI server, in Chrome but on [Saucelabs](https://saucelabs.com) servers.

#### Angular CLI
In case you need to build everything, run `npm run build`/`$(npm bin)/ng build` (use `npm run build:staging`/`npm run build:production` if the build is for staging, production respectively).

To see what other commands are available, run `$(npm bin)/ng help`.


### Deployments
---------------
Deployments are handled by [Travis CI](https://travis-ci.org).
Pushing to the `production`/`staging` branch will automatically deploy the app, given that all tests pass.


### Learning Material
---------------------
* [Angular 2 Education](https://github.com/timjacobi/angular2-education)
* [Awesome Angular 2](https://github.com/angular-class/awesome-angular2)
* [Angular Docs](https://angular.io)
* [Flex Layout](https://github.com/angular/flex-layout/wiki/API-Overview)
* [Material 2 Docs](https://material.angular.io/guide/getting-started)
* [Google Material](http://material.io)
* [Thoughtram](https://blog.thoughtram.io/exploring-angular-2)
* [Egghead](https://egghead.io/technologies/angular2)


### Browser Support
-------------------
You can expect the app to run wherever Angular does, but check the matrix below to see where the project tests pass.

[![Sauce Test Status](https://saucelabs.com/browser-matrix/rolandjitsu.svg)](https://saucelabs.com/u/rolandjitsu)


### Contribute
--------------
If you wish to contribute, please use the following guidelines:
* Use [Conventional Changelog](https://github.com/conventional-changelog/conventional-changelog-angular/blob/master/convention.md) when committing changes
* Follow [Angular Styleguide](https://angular.io/styleguide)
* Use `npm run lint` to fix any TS warnings/errors before you check in anything:
	* It will run [TSLint](http://palantir.github.io/tslint) to check for any inconsistencies
	* It will check against Angular styleguide using [codelyzer](https://www.npmjs.com/package/codelyzer)
* Use `[ci skip]` in commit messages to skip a build (e.g. when making docs changes)


### Credits
-----------
In the making of this simple app, I have made use of whatever resources I could find out there,
thus, it's worth mentioning that the following projects have served as inspiration and help:

* [ng2-play](https://github.com/pkozlowski-opensource/ng2-play)
