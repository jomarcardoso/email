const gulp = require('gulp');
const gulpSass = require('gulp-sass');
const gulpInlineCss = require('gulp-inline-css');
const fs = require('fs');

function sassTask() {
  return gulp.src('./src/scss/**/*.scss')
    .pipe(gulpSass()
    .on('error', gulpSass.logError))
    .pipe(gulp.dest('./src/temp/css'))
}

function inlineCssTask({
  src = './src/vm/**/*.vm',
  extraCss = '',
  dist = './src/temp/vm',
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
  return  () => inlineCssTask({
    extraCss: getCssContentBySrc(`./src/temp/css/themes/${themeName}.css`),
    dist: `./src/temp/vm/${themeName}`,
  })
}

function getInlineCssTasksByThemes() {
  const src = './src/scss/themes';
  const themeFiles = fs.readdirSync(src);
  const themeFileNames = themeFiles.map((name) => name.replace('.scss', ''));
  const tasks = themeFileNames.map(generateInlineCssTaskByThemeName);

  return tasks;
}

const inlineCSSTasks = getInlineCssTasksByThemes();

const defaultTask = gulp.series(sassTask, ...inlineCSSTasks);

exports.default = defaultTask;
