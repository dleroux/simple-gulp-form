var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');
var browserSync = require('browser-sync');
var postcss = require('gulp-postcss');
var gutil = require('gulp-util');

watchify.args.debug = true;
var bundler = watchify(browserify('./src/js/js.js', watchify.args));
bundler.transform(babel, {presets: ["es2015"]});

function jsTask(){
    gutil.log('Running JS Task...');
    return bundler.bundle()
        .on('error', function(err) { console.error(err); this.emit('end'); })
        .pipe(source('build.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist'));
}

function cssTask(){
    gutil.log('Running CSS Task...');
    return gulp.src('./src/css/**/*.css')
        .pipe( sourcemaps.init() )
        .pipe( postcss([ require('precss'), require('autoprefixer') ]) )
        .pipe( sourcemaps.write('.') )
        .pipe( gulp.dest('./dist') );
}

function browserSyncTask(){
    browserSync({
        server: {
            baseDir: "./"
        }
    });
}

gulp.task('css', function () { return cssTask(); });
gulp.task('script', function() { return jsTask(); });
gulp.task('browser-sync', function() { return browserSyncTask(); });

gulp.task('watch', function() {
    gulp.watch('./src/css/**/*.css', ['css', browserSync.reload]);
    gulp.watch(['./src/js/**/*.js'], ['script', browserSync.reload]);
    gulp.watch("*.html", browserSync.reload);
});


gulp.task('default', ['css', 'script', 'browser-sync', 'watch']);