var del = require('del');
var gulp = require('gulp');
var less = require('gulp-less');
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
  client: './src/',
  dist: 'dist/'
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

gulp.task('clean', ['clean-styles']);

gulp.task('clean-styles', function (done) {
  del('./src/css/superhero.css');
  done();
});

gulp.task('styles', function () {
  return gulp.src(config.less)
    .pipe(plumber())
    .pipe(less())
    .on('error', function (err) {
      // Should be obsolete in gulp 4.0. In gulp 3.6.x - cause watch to fail.
      console.log(err);
      this.emit('end');
    })
    .pipe(prefixer({browsers: ['last 2 versions', '> 5%']}))
    .pipe(gulp.dest("./src/css/"));
});

gulp.task('less-watch', function () {
  gulp.watch([config.less], ['styles'])
});

gulp.task('wiredep', ['styles'], function () {
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
  del(config.dist);
  done();
});

gulp.task('dist-fonts', function () {
  return gulp.src(config.fonts)
    .pipe(print())
    .pipe(flatten())
    .pipe(gulp.dest(config.dist + '/fonts'))
});

gulp.task('dist-libs', function() {
  return gulpBowerFiles().pipe(print());
});

gulp.task('dist-templates', function() {
  return gulp.src(config.html)
    .pipe(print())
    .pipe(gulp.dest(config.dist))
});

gulp.task('dist', ['clean-dist', 'dist-templates', 'dist-fonts', 'wiredep'], function () {
  return gulp
    .src(config.index)
    .pipe(plumber())
    .pipe(useref())
    .pipe(gulp.dest(config.dist));
});

