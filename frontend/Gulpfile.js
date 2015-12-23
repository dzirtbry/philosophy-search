var del = require('del');
var gulp = require('gulp');
var less = require('gulp-less');
var wiredep = require('wiredep');
var print = require('gulp-print');
var inject = require('gulp-inject');
var plumber = require('gulp-plumber');
var prefixer = require('gulp-autoprefixer');

var config = {
  less: ['./src/less/superhero.less'],
  index: ['./src/index.html'],
  js: [
    './src/js/**/*.module.js',
    './src/js/**/*.js'
  ],
  client: './src/'
};

config.wiredepOptions = function() {
  var options = {
    bowerJson: require('./bower.json'),
    directory: './src/bower_components/'
    //ignorePath: '..'
  };
  return options;
};

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

gulp.task('wiredep', /*['styles'],*/ function () {
  var options = config.wiredepOptions();
  wireStream = wiredep.stream;
  return gulp.src(config.index)
    .pipe(print())
    .pipe(wireStream(options))
    .pipe(inject(gulp.src(config.js), {relative: true}))
    .pipe(gulp.dest(config.client))
});

gulp.task('dist', ['styles'], function () {
  console.log('Hello world');
});

