var gulp = require("gulp");
var concat = require("gulp-concat");
var browserify = require("browserify");
var babelify = require("babelify");
var source = require("vinyl-source-stream");
var addSrc = require("gulp-add-src");
var eslint = require("gulp-eslint");

var config = {
  paths: {
    js: "./web/static/js/**/*.js",
    appJs: "./web/static/js/app.js",
    output: "./priv/static",
    assets: "./web/static/assets/**/*.*",
    css: [
      "node_modules/bootswatch/darkly/bootstrap.min.css",
      "node_modules/leaflet/dist/leaflet.css",
      "node_modules/drmonty-leaflet-awesome-markers/css/leaflet.awesome-markers.css",
      "./web/static/css/**/*.css"
    ],
    cssImages: [
      "node_modules/drmonty-leaflet-awesome-markers/css/**/*.png"
    ],
    fonts: [
      "node_modules/bootstrap/dist/fonts/*.*"
    ],
    images: [
      "node_modules/leaflet/dist/images/*.*"
    ]
  }
};

gulp.task("js", function() {
  browserify(config.paths.appJs, {debug: true})
    .transform(babelify, {presets: ["es2015", "react"]})
    .bundle()
    .on("error", console.error.bind(console)) // eslint-disable-line no-console
    .pipe(source("app.js"))
    .pipe(gulp.dest(config.paths.output + "/js"));
});

gulp.task("css", function() {
  gulp.src(config.paths.css)
    .pipe(concat("app.css"))
    .pipe(addSrc(config.paths.cssImages))
    .pipe(gulp.dest(config.paths.output + "/css"));
});

gulp.task("fonts", function() {
  gulp.src(config.paths.fonts)
    .pipe(gulp.dest(config.paths.output + "/fonts"));
});

gulp.task("images", function() {
  gulp.src(config.paths.images)
    .pipe(gulp.dest(config.paths.output + "/images"));
});

gulp.task("assets", function() {
  gulp.src(config.paths.assets)
    .pipe(gulp.dest(config.paths.output));
});

gulp.task("lint", function() {
  return gulp.src(config.paths.js)
    .pipe(eslint({config: ".eslintrc"}))
    .pipe(eslint.format());
});

gulp.task("build", [
  "js",
  "css",
  "fonts",
  "images",
  "assets"
]);

gulp.task("watch", function() {
  gulp.watch(config.paths.js, ["lint", "js"]);
  gulp.watch(config.paths.css, ["css"]);
});

gulp.task("default", ["lint", "build", "watch"]);
