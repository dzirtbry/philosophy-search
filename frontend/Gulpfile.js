var del = require('del');
var gulp = require('gulp');
var wiredep = require('wiredep');
var print = require('gulp-print');
var inject = require('gulp-inject');
var plumber = require('gulp-plumber');
var prefixer = require('gulp-autoprefixer');
var flatten = require('gulp-flatten');
var useref = require('gulp-useref');
var taskListing = require('gulp-task-listing');
var gulpBowerFiles = require('gulp-bower-files');

var config = {
  devVars: './src/env/dev.js',
  less: ['./src/less/superhero.less'],
  index: ['./src/index.html'],
  js: [
    './src/js/**/*.module.js',
    './src/js/**/*.js'
  ],
  css: [
    './src/css/**/*.css'
  ],
  fonts: [
    './src/bower_components/**/dist/fonts/**/*.*',
    './src/fonts/**/*.*'
  ],
  html: [
    './src/**/*.html',
    '!'+'./**/index.html'
  ],
  img: [
    './src/img/**/*.*'
  ],
  client: './src/',
  dist: 'dist/',
  distApp: 'dist/' + 'app/'


};

config.wiredepOptions = function () {
  var options = {
    bowerJson: require('./bower.json'),
    directory: './src/bower_components/'
    //ignorePath: '..'
  };
  return options;
};

gulp.task('help', taskListing);

gulp.task('test', function () {
  console.log('No tests this far.')
});

gulp.task('wiredep', function () {
  var options = config.wiredepOptions();
  wireStream = wiredep.stream;
  return gulp.src(config.index)
    .pipe(print())
    .pipe(wireStream(options))
    .pipe(inject(gulp.src(config.js.concat(config.devVars)), {relative: true}))
    .pipe(print())
    .pipe(inject(gulp.src(config.css), {relative: true}))
    .pipe(gulp.dest(config.client))
});

gulp.task('clean-dist', function(done) {
  del.sync(config.dist);
  done();
});

gulp.task('dist-fonts', function () {
  return gulp.src(config.fonts)
    .pipe(print())
    .pipe(flatten())
    .pipe(gulp.dest(config.distApp + '/fonts'))
});

gulp.task('dist-libs', function() {
  return gulpBowerFiles().pipe(print());
});

gulp.task('dist-templates', function() {
  return gulp.src(config.html)
    .pipe(print())
    .pipe(gulp.dest(config.distApp))
});

gulp.task('dist-images', function () {
  return gulp.src(config.img)
    .pipe(print())
    .pipe(gulp.dest(config.distApp + '/img'))
});

gulp.task('dist', ['clean-dist', 'dist-templates', 'dist-images', 'dist-fonts', 'wiredep'], function () {
  return gulp
    .src(config.index)
    .pipe(plumber())
    .pipe(useref())
    .pipe(print())
    .pipe(gulp.dest(config.distApp));
});

