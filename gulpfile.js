const gulp = require('gulp');

// js
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const eslint = require("gulp-eslint");
var concat = require('gulp-concat');

// css
const sass = require("gulp-sass");
const autoprefixer = require("autoprefixer");
const rename = require("gulp-rename");
const postcss = require("gulp-postcss");
var concatCss = require('gulp-concat-css');
var minifyCSS = require('gulp-minify-css');

// html
const htmlmin = require('gulp-htmlmin');

// img
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");

// limpar antes do build
const del = require("del");

// browsersync
const browsersync = require("browser-sync").create();

// JS
function scripts() {
    return (
        gulp.src('src/js/**/*.js')
        .pipe(babel({
            presets: ["@babel/preset-env"]
        }))
        .pipe(uglify())
        .pipe(concat('app.js'))
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest('build/js'))
        .pipe(browsersync.stream())
    );
}

// Lint scripts
function scriptsLint() {
    return gulp
        .src(["./src/js/**/*.js"])
    //   .pipe(plumber())
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}

// CSS
function css() {
    return gulp
      .src(["./src/css/*.css", "./src/scss/*.scss"])
    //   .pipe(plumber())
      .pipe(sass({ outputStyle: "expanded" }))
      .pipe(postcss([autoprefixer()]))
      .pipe(concatCss("app.css"))
      .pipe(minifyCSS())
      .pipe(rename({ suffix: ".min" }))
      .pipe(gulp.dest("./build/css/"))
      .pipe(browsersync.stream());
}

// clean pasta build
function clean() {
  return del(["./build"]);
}

// html
function html() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'))
    .pipe(browsersync.stream());
}

// Optimize Images
function images() {
  return gulp
    .src("./src/img/**/*")
    .pipe(newer("./build/img"))
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: false,
              collapseGroups: true
            }
          ]
        })
      ])
    )
    .pipe(gulp.dest("./build/img"));
}

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./build/"
    },
    port: 3000
  });
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Watch files
function watchFiles() {
  gulp.watch(["./src/scss/**/*", "./src/css/**/*"], css);
  gulp.watch("./src/js/**/*", scripts);
  gulp.watch("./src/**/*.html", html);
  gulp.watch("./assets/img/**/*", images);
}

const build = gulp.series(clean, gulp.parallel(css, scripts, html, images));
const watch = gulp.parallel(watchFiles, browserSync);

exports.images = images;
exports.css = css;
exports.js = scripts;

exports.clean = clean;
exports.build = build;

exports.watch = watch;

exports.default = watch;