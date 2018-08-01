'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    rev = require('gulp-rev'),
    cleanCss = require('gulp-clean-css'),
    flatmap = require('gulp-flatmap'),
    htmlmin = require('gulp-htmlmin');

    var merge = require('merge-stream');


gulp.task('sass', function () {
    return gulp.src('./css/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./css/*.scss', ['sass']);
});

// Clean
gulp.task('clean', function () {
    return del(['dist']);
});

gulp.task('copyfonts', function () {
    gulp.src('./node_modules/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
        .pipe(gulp.dest('./dist/fonts'));
});

// Images
gulp.task('imagemin', function () {
    var main_img = gulp.src('img/*.{png,jpg,gif}')
        .pipe(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dist/img'));
    
    var products_img = gulp.src('img/poddony/*.{png,jpg,gif}')
        .pipe(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dist/img/poddony'));

    return merge(main_img,products_img);
});

gulp.task('usemin', function () {
    var dir1 = gulp.src('./*.html')
        .pipe(flatmap(function (stream, file) {
            return stream
                .pipe(usemin({
                    css: [rev()],
                    html: [function () {
                        return htmlmin({
                            collapseWhitespace: true
                        })
                    }],
                    js: [uglify(), rev()],
                    inlinejs: [uglify()],
                    inlinecss: [cleanCss(), 'concat']
                }))
        }))
        .pipe(gulp.dest('dist/'));

    var dir2 = gulp.src('./products/oblegchennyie/*.html')
    .pipe(flatmap(function (stream, file) {
        return stream
            .pipe(usemin({
                css: [rev()],
                html: [function () {
                    return htmlmin({
                        collapseWhitespace: true
                    })
                }],
                js: [uglify(), rev()],
                inlinejs: [uglify()],
                inlinecss: [cleanCss(), 'concat']
            }))
    }))
    .pipe(gulp.dest('dist/products/oblegchennyie/'));

    return merge(dir1,dir2);
});

gulp.task('build', ['clean'], function () {
    gulp.start('copyfonts', 'imagemin', 'usemin');
});

gulp.task('browser-sync', function () {
    var files = [
        './*.html',
        './css/*.css',
        './img/*.{png,jpg,gif}',
        './js/*.js'
    ];

    browserSync.init(files, {
        server: {
            baseDir: "./"
        }
    });

});

// Default task
gulp.task('default', ['browser-sync'], function () {
    gulp.start('sass:watch');
});