// Protractor configuration file,
// see link for more information https://github.com/angular/protractor/blob/master/lib/config.ts
const {SpecReporter} = require('jasmine-spec-reporter');

const {SAUCE_ALIASES} = require('./browsers');

const config = {};
const capabilities = {
    browserName: 'chrome',
    chromeOptions: {
        // Use headless Chrome https://github.com/angular/protractor/blob/master/docs/browser-setup.md#using-headless-chrome
        args: [
            '--headless',
            '--disable-gpu',
            '--js-flags=--expose-gc',
            '--no-sandbox'
        ],
        perfLoggingPrefs: {
            traceCategories: 'v8,blink.console,disabled-by-default-devtools.timeline,devtools.timeline'
        }
    },
    loggingPrefs: {
        performance: 'ALL',
        browser: 'ALL'
    }
};


// On Travis we use Saucelabs browsers.
if (process.env.TRAVIS) {
    Object.assign(config, {
        sauceUser: process.env.SAUCE_USERNAME,
        sauceKey: process.env.SAUCE_ACCESS_KEY,
        multiCapabilities: SAUCE_ALIASES.CI.map(capability => ({
            ...capability,
            build: `TRAVIS #${process.env.TRAVIS_BUILD_NUMBER} (${process.env.TRAVIS_BUILD_ID})`,
            'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
            name: 'Angular Lab (E2E)'
        }))
    });
}


Object.assign(config, {
    capabilities,
    allScriptsTimeout: 120000,
    specs: [
        './e2e/**/*.e2e-spec.ts'
    ],
    // https://github.com/angular/protractor/blob/master/docs/server-setup.md#connecting-directly-to-browser-drivers
    directConnect: !process.env.TRAVIS,
    baseUrl: 'http://localhost:4224/',
    framework: 'jasmine',
    jasmineNodeOpts: {
        showColors: true,
        showTiming: true,
        defaultTimeoutInterval: 120000,
        print: () => {}
    },
    // Option for Angular to test against Angular 2+ applications on the page.
    // Protractor will wait for the app to be stable before each action, and search within all apps when finding elements.
    // rootElement: 'rj-lab',
    // TODO: Use above when https://github.com/angular/protractor/issues/4336 is fixed
    useAllAngular2AppRoots: true,
    // Turn off control flow (https://github.com/angular/protractor/tree/master/exampleTypescript/asyncAwait)
    SELENIUM_PROMISE_MANAGER: false,
    onPrepare: () => {
        // Add jasmine spec reporter
        jasmine.getEnv()
            .addReporter(new SpecReporter({spec: {displayStacktrace: true}}));
        // Include jasmine expect
        require('jasmine-expect');
        // Transpile all TS to JS
        require('ts-node')
            .register({
                project: 'e2e/tsconfig.e2e.json'
            });
    }
});


module.exports = {
    config
};
