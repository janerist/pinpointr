"use strict";

var gulp = require("gulp");
var concat = require("gulp-concat");
var browserify = require("browserify");
var reactify = require("reactify");
var babelify = require("babelify");
var source = require("vinyl-source-stream");

var config = {
	paths: {
		js: "./web/static/js/**/*.js",
		appJs: "./web/static/js/app.js",
		output: "./priv/static",
		assets: "./web/static/assets/**/*.*",
		css: [
			"node_modules/bootstrap/dist/css/bootstrap.min.css",
			"./web/static/css/**/*.css"
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
		.pipe(gulp.dest(config.paths.output + "/css"));
});

gulp.task("assets", function() {
	gulp.src(config.paths.assets)
		.pipe(gulp.dest(config.paths.output));
});

gulp.task("watch", function() {
	gulp.watch(config.paths.js, ["js"]);
	gulp.watch(config.paths.css, ["css"])
});

gulp.task("default", ["js", "css", "assets", "watch"]);