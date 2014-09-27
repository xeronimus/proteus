var
    gulp = require('gulp'),
    gutil = require('gulp-util');

/**
 *   compiles our jade files to html
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
 * Starts the app with browser-sync
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
        .pipe(tap(function (file) {
            var filename = path.basename(file.path, '.json');
            gutil.log('Parsing input file', '\'' + gutil.colors.cyan(filename) + '\'');
            processedInputFiles.push(gutil.replaceExtension(filename, ''));
        }))
        .pipe(cheatSheetInputParser())
        .pipe(gulp.dest('app/storage/'));

    stream.on('end', function () {
        var allProcessedFiles = JSON.stringify(processedInputFiles);
        fs.writeFile('app/storage/index.json', allProcessedFiles, done);
        gutil.log('Writing index', allProcessedFiles);
    });

});

gulp.task('parseInputWatch', ['parseInput'], function () {
    gulp.watch(['input/**/*.txt', '!input/**/index.txt'], {}, ['parseInput']);
});


/**
 *  Lints all js files in /app with ESLint
 * */
var eslint = require('gulp-eslint');
gulp.task('lint', function () {
    gulp.src(['app/**/*.js', 'test/**/*.js', '!app/bower_components/**/*'])
        .pipe(eslint())
        .pipe(eslint.format());
});


/**
 * Runs our mocha unit tests with karma
 * */
var karma = require('karma').server;
gulp.task('test', function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});


/**
 * Watch for file changes and re-run tests on each change
 */
gulp.task('tdd', function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js'
    }, done);
});

/**
 *
 * */
gulp.task('default', ['lint', 'test'], function () {
    // place code for your default task here
});


