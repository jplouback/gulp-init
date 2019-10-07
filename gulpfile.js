const gulp = require('gulp');

// js
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const eslint = require("gulp-eslint");

// css
const sass = require("gulp-sass");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const rename = require("gulp-rename");
const postcss = require("gulp-postcss");

// limpar antes do build
const del = require("del");


function scripts() {
    return (
        gulp.src('src/js/*.js')
        .pipe(babel({
            presets: ["@babel/preset-env"]
        }))
        .pipe(uglify())
        .pipe(gulp.dest('build/js'))
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

function css() {
    return gulp
      .src("./src/scss/*.scss")
    //   .pipe(plumber())
      .pipe(sass({ outputStyle: "expanded" }))
      .pipe(rename({ suffix: ".min" }))
      .pipe(postcss([autoprefixer(), cssnano()]))
      .pipe(gulp.dest("./build/css/"))
    //   .pipe(browsersync.stream());
  }

  function clean() {
    return del(["./build"]);
  }

const build = gulp.series(clean, gulp.parallel(css, scripts));



exports.default = build;