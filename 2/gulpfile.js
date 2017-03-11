var gulp = require('gulp');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');

var destFolder = './dist/';
var settings = {
  js: {
    source: ['./js/**/*.js'],
    filename: 'app.min.js'
  },
  css: {
    source: ['./styles/**/*.css'],
    filename: 'styles.min.css'
  }
};

gulp.task('js', function() {
  var jsSettings = settings.js;

  return gulp
    .src(jsSettings.source)
    .pipe(uglify())
    .pipe(concat(jsSettings.filename))
    .pipe(gulp.dest(destFolder));
});

gulp.task('css', function() {
  var cssSettings = settings.css;

  return gulp
    .src(cssSettings.source)
    .pipe(autoprefixer())
    .pipe(csso())
    .pipe(concat(cssSettings.filename))
    .pipe(gulp.dest(destFolder));
});

gulp.task('default', ['js', 'css']);
