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
* [Angular Material](https://material.angular.io)

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
2. From the root of the project, install dependencies: `yarn install`/`npm install`; 

**NOTE**: Keep in mind that every package that was installed has to be invoked with either `$(npm bin)/<package>` or `node_modules/.bin/<package>`.
Or if you want to avoid writing all of that every time:

1. Install [direnv](http://direnv.net);
2. Setup `.envrc` (just a file) with `export PATH=$PATH:$PWD/node_modules/.bin`;
3. Run `direnv allow` at the root of the project where `.envrc` resides.

Now you can simply run `<package>`.


#### Firebase
##### Hosting
In order to use your own Firebase account for [hosting](https://firebase.google.com/docs/hosting/quickstart) the app, follow the instructions below:

1. Make sure that you ran `$(node bin)/npm install` so that [firebase-tools](https://github.com/firebase/firebase-tools) is installed.
Now run `$(npm bin)/firebase login:ci` to get an auth token (follow the steps you are given by the command);
2. Copy the token that was echoed in the terminal and put it somewhere safe for further usage;
3. Alternatively, export the token (`export FIREBASE_TOKEN=<your Firebase token here>`);
4. Replace `angular-lab-da3a7` with your own Firebase project id in `.firebaserc`.

Given that you have `FIREBASE_TOKEN` exported as env var, you can deploy the app to your own Firebase account with:
```shell
npm run deploy
```

Or you can also use the following to set `FIREBASE_TOKEN` and deploy:
```shell
FIREBASE_TOKEN=<your Firebase token here> npm run deploy
```

#### Travis CI
If you plan on using this setup with your own projects and you wish to setup Travis CI,
you must make sure of a few of things in order to have everything working properly on the CI:

1. For deployments, setup the env variable `FIREBASE_TOKEN` containing the token you got from `$(npm bin)/firebase login:ci`:
	- Encrypt the token using `travis encrypt FIREBASE_TOKEN=<your Firebase token>`, see [docs](https://docs.travis-ci.com/user/environment-variables/#Encrypted-Variables) to find out more about it;
	- Replace the `secure` key's value, where the Firebase token is in `.travis.yml`, with your own encrypted string generated from the previous step;
2. For tests that run on Saucelabs, setup the env variables `SAUCE_USERNAME` and `SAUCE_ACCESS_KEY`:
	- Replace `SAUCE_USERNAME` with your own username (no need to encrypt);
	- Encrypt the access key `SAUCE_ACCESS_KEY` using `travis encrypt SAUCE_ACCESS_KEY=<your Saucelabs access key>`;
	- Replace the `secure` key's value with the string generated from the previous step (it's right below `SAUCE_USERNAME` in `.travis.yml`);
3. Remove the `webhooks` section from `notifications` in `.travis.yml`.

If you don't want to deploy to Firebase on push skip the 1st step in the instructions above and remove the following in `.travis.yml`:
* `after_success: npm run deploy:ci` step;
* Encrypted `FIREBASE_TOKEN` env var.

If you don't use Saucelabs, skip the 2nd step and remove the following in `.travis.yml`;
* `sauce_connect` section from `addons`;
* `SAUCE_USERNAME` and encrypted `SAUCE_ACCESS_KEY` env vars.

Now, keep in mind that cloning this repo and continuing in the same project will give you some issues with Travis if you wish to set it up with your own account.
So I suggest you start out with a clean project and start git from scratch (`git init`),
then copy over things from this project (obviously, do not include `.git` - not visible on most UNIX base systems).


### Development
---------------
All you need to get started is `npm start` (or `npm start:prod` if you need to emulate a production environment).
Now you should see the app running in the browser (might take a while when compiling the first time).

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
* `npm run e2e`/`$(npm bin)/ng e2e`: e2e tests in Chrome;
* `npm run e2e:ci`: e2e tests on the CI server, in Chrome but on [Saucelabs](https://saucelabs.com) servers.

#### Angular CLI
In case you need to build everything, run `npm run build`/`$(npm bin)/ng build` (use `npm run build:prod` if the build is for production).

To see what other commands are available, run `$(npm bin)/ng help`,
or take a look at the `scripts` section in `package.json`.


### Deployments
---------------
Deployments are handled by [Travis CI](https://travis-ci.org).
Pushing to `master` will automatically deploy the app, given that all tests pass.


### Learning Material
---------------------
* [Awesome Angular](https://github.com/angular-class/awesome-angular)
* [Angular Docs](https://angular.io)
* [Flex Layout](https://github.com/angular/flex-layout/wiki/API-Overview)
* [Angular Material Docs](https://material.angular.io/guide/getting-started)
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
* Use `npm run lint`/`npm run lint:fix` to fix any TS warnings/errors before you check in anything:
	* It will run [TSLint](http://palantir.github.io/tslint) to check for any inconsistencies
	* It will check against Angular styleguide using [codelyzer](https://www.npmjs.com/package/codelyzer)
	* If `npm run lint:fix` was used, it will fix some errors
* Use `[ci skip]` in commit messages to skip a build (e.g. when making docs changes)


### Credits
-----------
In the making of this simple app, I have made use of whatever resources I could find out there,
thus, it's worth mentioning that the following projects have served as inspiration and help:

* [ng2-play](https://github.com/pkozlowski-opensource/ng2-play)
