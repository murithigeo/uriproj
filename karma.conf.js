if (process.env.CI) {
  BROWSERS =  ['ChromeHeadless', 'FirefoxHeadless']
} else {
  BROWSERS =  ['ChromeHeadless']
}

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['browserify', 'mocha'],

    // list of files / patterns to load and/or serve in the browser
    files: [
      'test/**/*.{ts,js}',
    ],

    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/**/*.{ts|js}': ['browserify']
    },
    
    browserify: {
      transform: [
        ['babelify', { "plugins": ["istanbul"] }]
      ]
    },

    coverageReporter: {
      reporters: [
        {'type': 'text'},
        {'type': 'lcovonly',
         'subdir': function (browser) {
           // normalize
           return browser.toLowerCase().split(/[ /-]/)[0]
         }}
      ]
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: BROWSERS,


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  })
}
