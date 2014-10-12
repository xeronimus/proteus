var
  through = require('through2'),
  path = require('path'),
  gutil = require('gulp-util'),
  rext = require('replace-ext'),
  parser = require('./cheatSheetInputParser');


var PLUGIN_NAME = 'proteus-parser';

function handleFile(file, enc, callback) {
  if (file.isStream()) {
    return callback(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
  }
  if (file.isNull()) {
    return callback(null, file);
  }
  if (path.extname(file.path) !== '.txt') {
    return callback(new gutil.PluginError(PLUGIN_NAME, 'Input Files are expected to be of type .txt'));
  }

  var filename = path.basename(file.path);
  gutil.log('Parsing input file', '\'' + gutil.colors.cyan(filename) + '\'');
  var parsedCheatSheet = parser.parse(file.contents.toString(enc));

  file.path = rext(file.path, '.json');
  file.contents = new Buffer(parsedCheatSheet);
  return callback(null, file);

}

module.exports = function () {
  return through.obj(handleFile);
};