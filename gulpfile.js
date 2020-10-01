const gulp = require('gulp');
const gulpSass = require('gulp-sass');
const gulpInlineCss = require('gulp-inline-css');
const fs = require('fs');
const gulpVTL = require('gulp-velocityjs2');
const del = require('del');

const config = {
  paths: {
    vm:  {
      src: './src/vm/common/**/*.vm',
      dest: './src/temp/vm'
    },
    vmInlineCss: {
      dest: './dist'
    }
  }
}

const delBuildTask = () => del(['./dist', './src/temp']);

function htmlTask () {
  return gulp.src(`${config.paths.vm.dest}/**/*.vm`)
    .pipe( gulpVTL() )
    .pipe(gulp.dest(config.paths.vmInlineCss.dest));
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
  dist = config.paths.vm.dest,
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
    dist: `${config.paths.vm.dest}/${themeName}`,
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

const defaultTask = gulp.series(delBuildTask, sassTask, gulp.parallel(...inlineCSSTasks), htmlTask);

exports.default = defaultTask;
