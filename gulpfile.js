const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const csso = require('gulp-csso');
const include = require('gulp-file-include');
const htmlmin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const jsmin = require('gulp-minify');

const buildJs = () => {
    return src('src/scripts/*.js')
        .pipe(jsmin())
        .pipe(dest('build/scripts'))
};

const buildHtml = () => {
    return src('src/**.html')
        .pipe(include({
            prefix: '@@'
        }))
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(dest('build'))
};

const buildSass = () => {
    return src('src/sass/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 version']
        }))
        .pipe(csso())
        .pipe(dest('build/styles/'));
};

const clear = () => del('build');

const browserSyncJob = () => {
    browserSync.init({
        server: 'build/',
    });

    watch('src/sass/*.scss', buildSass);
    watch('src/**.html', buildHtml);
    watch('src/scripts/*.js', buildJs)
};


exports.build = series(clear, buildSass, buildHtml);
exports.server = series(clear, buildSass, buildJs, buildHtml, browserSyncJob);
