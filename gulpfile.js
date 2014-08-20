var gulp = require('gulp');
var testotron = require('./lib/index.js');

gulp.task('default', function() {
  gulp.src('./js/*.js')
  .pipe(testotron({outputDirectory:'/foo/'}));
});