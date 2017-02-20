'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync'),
    nunjucksRender = require('gulp-nunjucks-render'),
    reload = function() {
        browserSync.reload();
    };
// Copy assets
gulp.task('assets', function() {
    gulp.src('./bower_components/bootstrap/dist/**/*')
        .pipe(gulp.dest('./app'));
    gulp.src('./bower_components/font-awesome/css/**/*')
        .pipe(gulp.dest('./app/css'));
    gulp.src('./bower_components/font-awesome/fonts/**/*')
        .pipe(gulp.dest('./app/fonts'));
    gulp.src('./bower_components/jquery/dist/**/*')
        .pipe(gulp.dest('./app/js'));
    gulp.src('./src/images/**/*')
        .pipe(gulp.dest('./app/images'));
});

// Nunjucks compiling
gulp.task('nunjucks', function() {
    // Gets .html and .nunjucks files in pages
    return gulp.src('src/templates/**/**/*.+(html|nunjucks)')
        // Renders template with nunjucks
        .pipe(nunjucksRender({
            path: ['src/templates']
        }))
        // output files in app folder
        .pipe(gulp.dest('app'))
});

// Sass stuff
gulp.task('sass', function() {
    gulp.src('./src/sass/*.scss')
        .pipe(sass({ outputStyle: 'expanded' }))
        .pipe(gulp.dest('./app/css'))
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('./app/css'));
});

// Copy JS files
gulp.task('js', function() {
    gulp.src('./src/js/**/*')
        .pipe(gulp.dest('./app/js'))
});

/* Run Jasmine stuff
gulp.task('jasmine', function () {
	return gulp.src('./src/spec/appSpec.js')
		// gulp-jasmine works on filepaths so you can't have any plugins before it
		.pipe(jasmine({
			showColors: true,
			print: function() {
				process.stdout.write(util.format.apply(this, arguments));
			}
		}));
});*/

// Static Server + watching scss/html files
gulp.task('serve', ['assets', 'sass', 'js', 'nunjucks'], function() {
    browserSync.init({
        server: "./app"
    });

    gulp.watch("./app/**/*", reload);
    gulp.watch("./src/sass/*", ['sass']);
    gulp.watch("./src/js/*", ['js']);
    gulp.watch("./src/templates/**/*", ['nunjucks']);
});


// Default task
gulp.task('default', ['serve']);
