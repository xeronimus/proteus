var
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  concat = require('gulp-concat'),
  karma = require('karma').server,
  jade = require('gulp-jade'),
  htmlreplace = require('gulp-html-replace'),
  parser = require('gulp-file-parser'),
  tap = require('gulp-tap'),
  fs = require('fs'),
  path = require('path'),
  del = require('del'),
  browserSync = require('browser-sync'),
  eslint = require('gulp-eslint'),
  deploy = require('gulp-gh-pages'),
  stylus = require('gulp-stylus');


/**
 *   compiles our jade files to html
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
 *   compiles our stylus files to css
 * */
gulp.task('stylus', function () {
  gulp.src('./app/styles/*.styl')
    .pipe(stylus())
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./app/styles'));
});

/**
 * Starts the app with browser-sync
 * */
var reload = browserSync.reload;
gulp.task('serve', ['jade', 'stylus', 'parseInputWatch'], function () {
  browserSync({
    server: {
      baseDir: 'app'
    }
  });

  gulp.watch(['*.jade', 'scripts/**/*.js'], {cwd: 'app'}, ['jade', reload]);
  gulp.watch(['styles/**/*.styl'], {cwd: 'app'}, [ 'stylus', reload]);
});

/**
 * parses cheat sheet input files and saves them as json in app/storage
 * */
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
gulp.task('lint', function () {
  gulp.src(['app/**/*.js', 'test/**/*.js', '!app/bower_components/**/*'])
    .pipe(eslint())
    .pipe(eslint.format());
});


/**
 * Runs our mocha unit tests with karma
 * */
gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true,
    autoWatch: false
  }, done);
});


/**
 * Watch for file changes and re-run tests on each change
 * */
gulp.task('tdd', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    autoWatch: true
  }, done);
});


/**
 * Build
 * */
gulp.task('build', [ 'lint', 'jade', 'test', 'parseInput', 'assemble', 'html-replace']);


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
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./build'));

  // concatenate all 3rd party js files (bower_components)
  gulp.src(['./app/bower_components/**/dist/**/*.js', './app/bower_components/**/build/*.js', './app/bower_components/angular/angular.js', './app/bower_components/angular-bootstrap/ui-bootstrap.js'])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./build/'));

  //  concatenates our own css files
  gulp.src('./app/styles/*.css')
    .pipe(concat('app.css'))
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
gulp.task('html-replace', ['clean', 'assemble'], function () {
  gulp.src('./app/index.html')
    .pipe(htmlreplace({
      'vendorjs': 'vendor.js',
      'css': 'styles/app.css',
      'js': 'app.js'
    }))
    .pipe(gulp.dest('build/'));
});


/**
 * eploys current build directory to github, branch "gh-pages"
 * */
gulp.task('deploy', function () {
  gulp.src('./build/**/*')
    .pipe(deploy());
});

/**
 *  The default task
 * */
gulp.task('default', ['build'], function () {
});


