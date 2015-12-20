var del = require('del');
var gulp = require('gulp');
var less = require('gulp-less');
var print = require('gulp-print');
var pref = require('gulp-autoprefixer');

gulp.task('test', function () {
  console.log('No tests this far.')
});

gulp.task('clean', ['clean-styles']);

gulp.task('clean-styles', function (done) {
  del('./src/css/superhero.css');
  done();
});

gulp.task('styles', ['clean-styles'], function () {
  return gulp.src(['./src/less/superhero.less'])
    .pipe(less())
    .pipe(pref({browsers: ['last 2 versions', '> 5%']}))
    .pipe(gulp.dest("./src/css/"));
});

gulp.task('dist', ['styles'], function () {
  console.log('Hello world');
});