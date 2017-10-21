// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html
const {CUSTOM_LAUNCHERS} = require('./browsers.js');


// Source: https://github.com/angular/angular/blob/master/karma-js.conf.js.
const sauceLabs = {
    testName: 'UNIT - Angular Lab',
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

if (process.env.TRAVIS) {
    sauceLabs.build = `TRAVIS #${process.env.TRAVIS_BUILD_NUMBER} (${process.env.TRAVIS_BUILD_ID})`;
    sauceLabs.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;
}


module.exports = function (config) {
    config.set({
        sauceLabs,
        basePath: '',
        frameworks: [
            'jasmine',
            '@angular/cli'
        ],
        plugins: [
            require('karma-jasmine'),
            require('karma-jasmine-html-reporter'),
            require('karma-chrome-launcher'),
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
            fixWebpackSourcePaths: true
        },
        angularCli: {
            environment: 'dev'
        },
        reporters: config.angularCli && config.angularCli.codeCoverage ? ['progress', 'coverage-istanbul'] : ['progress', 'kjhtml'],
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
