'use strict';

var gulp = require('gulp');
var del = require('del');
var spawn = require('child_process').spawn;
var chalk = require('chalk');
var plugins = require('gulp-load-plugins')();

/**

The port number allows you to configure what port to launch the
development server on.

The silence output option simple hides all out from the dev_appserver.
Change this to false if you want to see logs form app engine.

**/

var PORT_NUMBER = 7331;
var SILENCE_OUTPUT = false;

// These define the build locations
var WF = {
  appengine: 'appengine-config',
  build: 'build'
};

gulp.task('copy-appengine-config', ['gae:clean'], function() {
  return gulp.src([
      '!' + WF.appengine + '/scripts/*',
      WF.appengine + '/**/*'
    ])
    .pipe(plugins.copy(WF.build, {prefix: 1}));
});

gulp.task('spawn-gae-dev-command', function() {
  // Handle OS differences in executable name
  var gaeCommand = 'dev_appserver.py';
  var params = ['--port', PORT_NUMBER, WF.build];

  var stdioOption = SILENCE_OUTPUT ? 'ignore' : 'inherit';

  spawn(gaeCommand, params, {stdio: stdioOption});
});

gulp.task('pretty-print-gae-info', function() {
  console.log('');
  console.log('---------------------------------');
  console.log('');
  console.log(chalk.dim('    Server is on: ') +
    chalk.white('http://localhost:') + chalk.blue(PORT_NUMBER));
  console.log('');
  console.log('---------------------------------');
  console.log('');
});

// jekyll:target [--lang <lang_code,lang_code,...|all>]
// where 'target' is config/target.yml file.
// defaults to '--lang all'.
// 'all' builds for all languages specified in config.yml/langs_available + 'en'.
// builds w/o multilang support if config.yml is missing langs_available.
gulp.task('start-gae-dev-server', [
  'copy-appengine-config',
  'spawn-gae-dev-command',
  'pretty-print-gae-info'
]);

gulp.task('gae:clean', del.bind(null,
  [
    WF.build + '/*.yaml',
    WF.build + '/*.py',
    WF.build + '/*.pyc',
    WF.build + '/*.tpl',
    WF.build + '/robots.txt',
  ], {dot: true}));