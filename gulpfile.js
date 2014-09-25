var
    gulp = require('gulp')   ,
    browserSync = require('browser-sync'),
    jade = require('gulp-jade');

/**
 *
 * */
gulp.task('jade', function () {
    var YOUR_LOCALS = {};

    gulp.src('./app/*.jade')
        .pipe(jade({
            pretty: true,
            locals: YOUR_LOCALS
        }))
        .pipe(gulp.dest('./app/'))
});

/**
 *
 * */
var reload = browserSync.reload;
gulp.task('serve', ['jade'], function () {
    browserSync({
        server: {
            baseDir: 'app'
        }
    });

    gulp.watch(['*.jade', 'styles/**/*.css', 'scripts/**/*.js'], {cwd: 'app'}, ['jade', reload]);
});


/**
 * parses cheat sheet input files and saves them as json in app/storage
 * */
var parser = require('gulp-file-parser');
var rename = require("gulp-rename");
gulp.task('parseInput', function () {

    var cheatSheetInputParser = parser({
        name: 'cs-input',
        func: require('./tasks/cheatSheetInputParser').parse,
        extension: '.txt'
    });

    gulp.src(['input/**/*.txt', '!input/**/index.txt'])
        .pipe(cheatSheetInputParser())
        .pipe(rename(function (path) {
            path.extname = ".json"
        }))
        .pipe(gulp.dest('app/storage/'));
});

/**
 *
 * */
gulp.task('default', function () {
    // place code for your default task here
});


