var gulp = require("gulp");
let gulpUglify = require("gulp-uglify");
// var gulpMinify = require("gulp-minify");
// let gulpCompress = require("gulp-imagemin");
var amdOpt = require("amd-optimize");
var concat = require("gulp-concat");
var pipeline = require('readable-stream').pipeline;


gulp.task("uglyfy", function () {
    //Working AMP builder
     /*return gulp.src("js/scripts/**.js")
    // Traces all modules and outputs them in the correct order.
        .pipe(amdOpt("app",{
            paths:{
                "jquery":"js/libs/jquery",
                "app":"js/scripts/app"
            }
        }))
        .pipe(concat("index.js"))
        .pipe(gulp.dest("build"));*/

    /*
    return gulp.src("build/index.js")
    // Traces all modules and outputs them in the correct order.
        .pipe(gulpMinify())
        .pipe(gulp.dest("build/last"));*/

    return pipeline(
        gulp.src('build/index.js'),
        gulpUglify(),
        gulp.dest('build/uglyfied')
    );
    /*return gulp.src('assets/*.png')
            .pipe(gulpCompress([
                gulpCompress.optipng({optimizationLevel: 5})
            ]))
            .pipe(gulp.dest('build/assets'));*/


});
gulp.task("buildJS", function () {
    //Working AMP builder
    return gulp.src("js/scripts/**.js")
   // Traces all modules and outputs them in the correct order.
       .pipe(amdOpt("app",{
           paths:{
               "jquery":"js/libs/jquery",
               "app":"js/scripts/app"
           }
       }))
       .pipe(concat("index.js"))
       .pipe(gulp.dest("build"));

    /*
    return gulp.src("build/index.js")
    // Traces all modules and outputs them in the correct order.
        .pipe(gulpMinify())
        .pipe(gulp.dest("build/last"));*/

    /*return pipeline(
        gulp.src('build/index.js'),
        gulpUglify(),
        gulp.dest('build/uglyfied')
    );*/
    /*return gulp.src('assets/*.png')
            .pipe(gulpCompress([
                gulpCompress.optipng({optimizationLevel: 5})
            ]))
            .pipe(gulp.dest('build/assets'));*/


});