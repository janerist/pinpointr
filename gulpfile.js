"use strict";

var gulp = require("gulp");
var concat = require("gulp-concat");
var browserify = require("browserify");
var reactify = require("reactify");
var babelify = require("babelify");
var source = require("vinyl-source-stream");
var addSrc = require("gulp-add-src");

var config = {
	paths: {
		js: "./web/static/js/**/*.js",
		appJs: "./web/static/js/app.js",
		output: "./priv/static",
		assets: "./web/static/assets/**/*.*",
		css: [
			"node_modules/bootstrap/dist/css/bootstrap.min.css",
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
	browserify(config.paths.appJs)
		.transform(babelify)
		.transform(reactify)
		.bundle()
		.on("error", console.error.bind(console))
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
		.pipe(gulp.dest(config.paths.output + "/images"))
});

gulp.task("assets", function() {
	gulp.src(config.paths.assets)
		.pipe(gulp.dest(config.paths.output));
});

gulp.task("build", [
  "js", 
  "css", 
  "fonts", 
  "images", 
  "assets", 
]);

gulp.task("watch", function() {
	gulp.watch(config.paths.js, ["js"]);
	gulp.watch(config.paths.css, ["css"])
});

gulp.task("default", ["build", "watch"]);
