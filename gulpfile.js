var
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    plugins = require('gulp-load-plugins')({lazy: false});

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
 *   compiles our stylus files to css
 * */

var stylus = require('gulp-stylus');
gulp.task('stylus', function () {
    gulp.src('./app/styles/*.styl')
        .pipe(stylus())
        .pipe(plugins.concat('style.css'))
        .pipe(gulp.dest('./app/styles'));
});

/**
 * Starts the app with browser-sync
 * */
var browserSync = require('browser-sync');
var reload = browserSync.reload;
gulp.task('serve', ['jade', 'stylus', 'parseInputWatch'], function () {
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
 * */
gulp.task('tdd', function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js'
    }, done);
});


/**
 * Build
 * */
gulp.task('build', [ 'lint', 'jade', 'test', 'assemble', 'html-replace']);

var del = require('del');
gulp.task('clean', function (cb) {
    del(['./build'], function (err) {
        if (err) {
            cb(err);
            return;
        }
        gutil.log('Cleaned build directory...');
        cb();
    });
});


/**
 * assembles all files and copies them to ./build/
 * */
gulp.task('assemble', ['clean'], function () {

    // concatenates our own js files
    gulp.src(['./app/scripts/module.js', './app/scripts/*.js'])
        .pipe(plugins.concat('app.js'))
        .pipe(gulp.dest('./build'));

    // concatenate all 3rd party js files (bower_components)
    gulp.src(['./app/bower_components/**/dist/**/*.js', './app/bower_components/**/build/*.js', './app/bower_components/angular/angular.js'])
        .pipe(plugins.concat('vendor.js'))
        .pipe(gulp.dest('./build/'));

    //  concatenates our own css files
    gulp.src('./app/styles/*.css')
        .pipe(plugins.concat('app.css'))
        .pipe(gulp.dest('./build/styles'));

    // concatenate all 3rd party css files (bower_components)
    gulp.src(['./app/bower_components/**/dist/**/*.css', '!*.min.css'])
        .pipe(plugins.concat('vendor.css'))
        .pipe(gulp.dest('./build/styles'));

    // copies storage (cheat sheet files) , images
    gulp.src('./app/storage/*.json')
        .pipe(gulp.dest('./build/storage'));
    gulp.src('./app/images/*')
        .pipe(gulp.dest('./build/images'));

});


/**
 *  replace build blocks in index.html
 */
var htmlreplace = require('gulp-html-replace');
gulp.task('html-replace', ['clean', 'assemble'], function () {
    gulp.src('./app/index.html')
        .pipe(htmlreplace({
            'vendorcss': 'styles/vendor.css',
            'vendorjs': 'vendor.js',
            'css': 'styles/app.css',
            'js': 'app.js'
        }))
        .pipe(gulp.dest('build/'));
});


/**
 *
 * */
var deploy = require('gulp-gh-pages');
gulp.task('deploy', function () {
    gulp.src("./build/**/*")
        .pipe(deploy());
});

/**
 *  The default task
 * */
gulp.task('default', ['build'], function () {
});


