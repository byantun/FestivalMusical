const { src, dest, watch, parallel } = require('gulp');
//CSS
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

//IMAGENES
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

//JavaScripts
const terser = require('gulp-terser-js')



function css(cb){
    
    src('src/scss/**/*.scss')//Identificar el archivo scss a compilar
        .pipe(sourcemaps.init())
        .pipe( plumber() )//Para que no se detenga con cualquier error y se tenga que levantar de nuevo
        .pipe( sass() )//Compilarlo
        .pipe( postcss([ autoprefixer(), cssnano() ]))
        .pipe( sourcemaps.write('.'))
        .pipe( dest('build/css'))//Almacenarlo en el disco duro
    cb();
}

function imagenes(cb){
    const opciones = {
        optimizationLevel: 3
    }
    src('img/**/*.{png,jpg}')
        .pipe(cache(imagemin(opciones)))
        .pipe(dest('build/img'))
    cb();
}

function versionWebp( cb){
    const opciones = {
        quality: 50
    };

    src('img/**/*.{png,jpg}')
        .pipe(webp(opciones))
        .pipe(dest('build/img'))
    cb();
}

function versionAvif( cb){
    const opciones = {
        quality: 50
    };

    src('img/**/*.{png,jpg}')
        .pipe(avif(opciones))
        .pipe(dest('build/img'))
    cb();
}

function js(cb){
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'));

    cb();
}

function dev(cb){
    watch('src/scss/**/*.scss', css);
    watch('src/js/**/*.js', js);

    cb();
}

exports.css = css;
exports.js = js;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel(imagenes,versionWebp,versionAvif,js,dev);