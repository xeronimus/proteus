var gulp = require('gulp');

/**
 *
 * */
var jade = require('gulp-jade');
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
var browserSync = require('browser-sync');
var reload = browserSync.reload;
gulp.task('serve', ['jade', 'parseInputWatch'], function () {
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
var tap = require('gulp-tap');
var fs = require('fs');
var path = require('path');
gulp.task('parseInput', function (done) {

    var cheatSheetInputParser = parser({
        name: 'cs-input',
        func: require('./tasks/cheatSheetInputParser').parse,
        extension: '.json'
    });

    var processedInputFiles = [];
    var stream = gulp.src(['input/**/*.txt', '!input/**/index.txt'])
        .pipe(cheatSheetInputParser())
        .pipe(tap(function (file) {
            processedInputFiles.push(path.basename(file.path, '.json'));
        }))
        .pipe(gulp.dest('app/storage/'));

    stream.on('end', function () {
        fs.writeFile('app/storage/index.json', JSON.stringify(processedInputFiles), done);
    });

});

gulp.task('parseInputWatch', ['parseInput'], function () {
    gulp.watch(['input/**/*.txt', '!input/**/index.txt'], { }, ['parseInput']);
});

/**
 *
 * */
gulp.task('default', function () {
    // place code for your default task here
});


