// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html
const {CUSTOM_LAUNCHERS} = require('./browsers');


// Source: https://github.com/angular/angular/blob/master/karma-js.conf.js.
const sauceLabs = {
    testName: 'Angular Lab (Unit)',
    retryLimit: 3,
    startConnect: false,
    recordVideo: false,
    recordScreenshots: false,
    options: {
        'command-timeout': 600,
        'idle-timeout': 600,
        'max-duration': 5400
    }
};


module.exports = function (config) {
    const reporters = config.angularCli && config.angularCli.codeCoverage ? ['progress', 'coverage-istanbul'] : ['progress', 'kjhtml'];

    if (process.env.TRAVIS) {
        sauceLabs.build = `TRAVIS #${process.env.TRAVIS_BUILD_NUMBER} (${process.env.TRAVIS_BUILD_ID})`;
        sauceLabs.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;
        // Also use the SauceLabs reporter provided by 'karma-sauce-launcher',
        // otherwise the `{passed}` flag never gets set (hence the gray builds in the browser matrix badge).
        reporters.push('saucelabs');
    }

    config.set({
        sauceLabs,
        reporters,
        basePath: '',
        frameworks: [
            'jasmine',
            '@angular/cli'
        ],
        plugins: [
            require('karma-jasmine'),
            require('karma-jasmine-html-reporter'),
            require('karma-chrome-launcher'),
            require('karma-sauce-launcher'),
            require('karma-coverage-istanbul-reporter'),
            require('@angular/cli/plugins/karma')
        ],
        client: {
            // Leave Jasmine Spec Runner output visible in browser.
            clearContext: false
        },
        files: [
            {pattern: './src/test.ts', watched: false}
        ],
        preprocessors: {
            './src/test.ts': ['@angular/cli']
        },
        mime: {
            'text/x-typescript': ['ts', 'tsx']
        },
        coverageIstanbulReporter: {
            reports: ['html', 'lcovonly'],
            fixWebpackSourcePaths: true,
            thresholds: {
                statements: 80,
                lines: 80,
                branches: 40,
                functions: 60
            }
        },
        angularCli: {
            environment: 'dev'
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        singleRun: false,
        customLaunchers: CUSTOM_LAUNCHERS,
        browsers: [
            'Chrome'
        ]
    });
};
