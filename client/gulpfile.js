const { src, dest } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const purgecss = require('gulp-purgecss');

function buildStyles() {
    return src('src/assets/scss/main.scss')
    .pipe(sass())
    .pipe(purgecss({ content: ['src/components/**/*.js', 'src/index.js'] }))
    .pipe(dest('src/assets/css'))
}

exports.default = buildStyles