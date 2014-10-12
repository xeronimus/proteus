var
  gulp = require('gulp'),
  fs = require('fs'),
  path = require('path'),
  gutil = require('gulp-util'),
  concat = require('gulp-concat'),
  cheatSheetInputParser = require('./tasks/gulpCheatSheetInputParser'),
  karma = require('karma').server,
  jade = require('gulp-jade'),
  htmlreplace = require('gulp-html-replace'),
  del = require('del'),
  browserSync = require('browser-sync'),
  eslint = require('gulp-eslint'),
  deploy = require('gulp-gh-pages'),
  mocha = require('gulp-mocha'),
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
gulp.task('serve', ['jade', 'stylus', 'createCsStorageWatch'], function () {
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
gulp.task('parseInput', ['cleanCsStorage'], function () {
  return gulp.src(['input/**/*.txt', '!input/**/index.txt'])
    .pipe(cheatSheetInputParser())
    .pipe(gulp.dest('app/storage/'));

});

gulp.task('cleanCsStorage', function (cb) {
  del(['./app/storage'], function (err) {
    cb(err);
  });
});

/**
 * parses input files ([parseInput]) and generates index.json
 * */
gulp.task('createCsStorage', ['parseInput'], function (done) {
  fs.readdir('./app/storage', function (err, files) {
    if (err) {
      throw new Error(err);
    }
    gutil.log('Saving storage index file: ' + files.length + ' cheat sheets...');

    files.forEach(function (file) {
      if (path.extname(file) !== '.json') {
        throw new Error('Expect all files in storage to be json files!');
      }
    });
    fs.writeFile('app/storage/index.json', JSON.stringify(files).replace(/\.json/g, ''), function (err) {
      if (err) {
        throw new Error(err);
      }
      gutil.log('Storage index file saved');
      done();
    })
  });

});

gulp.task('createCsStorageWatch', ['createCsStorage'], function () {
  gulp.watch(['input/**/*.txt', '!input/**/index.txt'], {}, ['createCsStorage']);
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
 * Runs our inputParser unit test
 * */
gulp.task('infratest', function () {
  gulp.src('test/infrastructure/**/*.js', {read: false})
    .pipe(mocha({reporter: 'spec'}));
});

/**
 * Runs our mocha (frontend) unit tests with karma
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
gulp.task('build', [ 'lint', 'jade', 'test', 'infratest', 'createCsStorage', 'assemble', 'html-replace']);


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


