(function () {
    'use strict';

    var gulp = require('gulp');
    var jscs = require('gulp-jscs-custom');

    var paths = [
        'common/**/*.js',
        '!**/*.json'
    ];

    gulp.task('jscs', function () {
        return gulp.src(paths)
                   .pipe(jscs({
                       esnext: false,
                       configPath: '.jscsrc',
                       reporter: 'console'
                   }));
    });

    gulp.task('default', ['jscs']);
})();

