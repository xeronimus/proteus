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
 *
 * */
gulp.task('default', function () {
    // place code for your default task here
});