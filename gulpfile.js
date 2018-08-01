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

    var fs = require('fs');
    var path = require('path');
    


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
    var main_img = gulp.src('img/*')
        .pipe(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dist/img'));
    
    var products_img = gulp.src('img/poddony/*')
        .pipe(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dist/img/poddony'));

    return merge(main_img,products_img);
});

var htmlPath = '.';

function getFolders (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            if (name.indexOf('products') > -1
                || name.indexOf('contacts') > -1) 
                files_.push(name);
            getFolders(name, files_);
        };
    }
    return files_;
}

gulp.task('usemin_all', function () {

    var folders = getFolders(htmlPath);
    console.log(folders);

    var folders_min = folders.map(function(folder) {
        return gulp.src(path.join(htmlPath,folder,'/*.html'))
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
        .pipe(gulp.dest('dist/'+folder));
    });

    var main_min = gulp.src(htmlPath+'/*.html')
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

    return merge(folders_min,main_min);
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
    gulp.start('copyfonts', 'imagemin', 'usemin_all');
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