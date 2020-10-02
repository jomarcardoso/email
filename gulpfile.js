const gulp = require('gulp');
const gulpSass = require('gulp-sass');
const gulpInlineCss = require('gulp-inline-css');
const fs = require('fs');
const gulpVTL = require('gulp-velocityjs2');
const del = require('del');
const gulpRemoveCode = require('gulp-remove-code');

const config = {
  paths: {
    vm:  {
      src: './src/vm/common/**/*.vm',
      temp: './src/temp/vm',
      dest: './dist/vm'
    },
    vmInlineCss: {
      dest: './dist'
    },
    html: {
      dest: './dist/html'
    }
  }
}

const delBuildTask = () => del(['./dist', './src/temp']);

function htmlTask () {
  return gulp.src(`${config.paths.vm.temp}/**/*.vm`)
    .pipe(gulpVTL())
    .pipe(gulp.dest(config.paths.html.dest));
}

function vmTask() {
  return gulp.src(`${config.paths.vm.temp}/**/*.vm`)
    .pipe(gulpRemoveCode({
      commentStart: '##',
      production: true,
    }))
    .pipe(gulp.dest(config.paths.vm.dest));
}

function sassTask() {
  return gulp.src('./src/scss/**/*.scss')
    .pipe(gulpSass()
    .on('error', gulpSass.logError))
    .pipe(gulp.dest('./src/temp/css'))
}

function inlineCssTask({
  src = config.paths.vm.src,
  extraCss = '',
  dist = config.paths.vm.temp,
} = {}) {
  const files = gulp.src(src);

  return files
    .pipe(gulpInlineCss({
      removeHtmlSelectors: true,
      extraCss,
    }))
    .pipe(gulp.dest(dist));
}

function getCssContentBySrc(src = '') {
  try {
    return fs.readFileSync(src, 'utf8');
  } catch(e) {
    console.log('Error:', e.stack);
    return '';
  }
}

function generateInlineCssTaskByThemeName(themeName = '') {
  return themeInlineCssTask = () => inlineCssTask({
    extraCss: getCssContentBySrc(`./src/temp/css/themes/${themeName}.css`),
    dist: `${config.paths.vm.temp}/${themeName}`,
    src: [config.paths.vm.src, `./src/vm/themes/${themeName}/**/*.vm`],
  });
}

function getInlineCssTasksByThemes() {
  const src = './src/scss/themes';
  const themeFiles = fs.readdirSync(src);
  const themeFileNames = themeFiles.map((name) => name.replace('.scss', ''));
  const tasks = themeFileNames.map(generateInlineCssTaskByThemeName);

  return tasks;
}

const inlineCSSTasks = getInlineCssTasksByThemes();

const defaultTask = gulp.series(delBuildTask, sassTask, gulp.parallel(...inlineCSSTasks), htmlTask, vmTask);

exports.default = defaultTask;
