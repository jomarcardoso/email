const gulp = require('gulp');
const gulpSass = require('gulp-sass');
const gulpInlineCss = require('gulp-inline-css');
const fs = require('fs');
const gulpVTL = require('gulp-velocityjs2');
const del = require('del');
const gulpRemoveCode = require('gulp-remove-code');
const gulpHeader = require('gulp-header');
const gulpInject = require('gulp-inject');

function getThemes() {
  const src = './src/scss/themes';
  const themeFiles = fs.readdirSync(src);
  const themeFileNames = themeFiles.map((name) => name.replace('.scss', ''));

  return themeFileNames;
}

const config = {
  paths: {
    vm: {
      src: './src/vm/common/**/*.vm',
      temp: './src/temp/vm',
      dest: './dist/vm',
    },
    vmInlineCss: {
      dest: './dist',
    },
    html: {
      dest: './dist/html',
    },
  },
  themes: getThemes(),
};

const delBuildTask = () => del(['./dist', './src/temp']);

function htmlTask() {
  return gulp
    .src(`${config.paths.vm.temp}/**/*.vm`)
    .pipe(
      gulpVTL(undefined, {
        escape: false,
      })
    )
    .pipe(gulp.dest(config.paths.html.dest));
}

function vmTask() {
  return gulp
    .src(`${config.paths.vm.temp}/**/*.vm`)
    .pipe(
      gulpRemoveCode({
        commentStart: '##',
        production: true,
      })
    )
    .pipe(gulp.dest(config.paths.vm.dest));
}

function sassTask() {
  return gulp
    .src('./src/scss/**/*.scss')
    .pipe(gulpSass().on('error', gulpSass.logError))
    .pipe(gulp.dest('./src/temp/css'));
}

function inlineCssTask({
  src = config.paths.vm.src,
  extraCss = '',
  dist = config.paths.vm.temp,
} = {}) {
  const files = gulp.src(src);

  return files
    .pipe(
      gulpInlineCss({
        removeHtmlSelectors: true,
        applyTableAttributes: true,
        removeStyleTags: false,
        applyWidthAttributes: true,
        extraCss,
      })
    )
    .pipe(gulp.dest(dist));
}

function getInlineCssTasksByThemes() {
  function getCssContentBySrc(src = '') {
    try {
      return fs.readFileSync(src, 'utf8');
    } catch (e) {
      console.log('Error:', e.stack);
      return '';
    }
  }

  function generate(themeName = '') {
    return (themeInlineCssTask = () =>
      inlineCssTask({
        extraCss: getCssContentBySrc(`./src/temp/css/themes/${themeName}.css`),
        dist: `${config.paths.vm.temp}/${themeName}`,
        src: [config.paths.vm.src, `./src/vm/themes/${themeName}/**/*.vm`],
      }));
  }

  const tasks = config.themes.map(generate);

  return tasks;
}

function concatTask({ folder = '', commonFiles = [] } = {}) {
  const stream = gulp.src(`${folder}/*.vm`);

  commonFiles.forEach((commonFile) =>
    stream.pipe(gulpHeader(fs.readFileSync(commonFile, 'utf8')))
  );

  return stream.pipe(gulp.dest(folder));
}

function getConcatTasks() {
  function generate(themeName = '') {
    return (themeConcatTask = () =>
      concatTask({
        folder: `./src/temp/vm/${themeName}`,
        commonFiles: [
          './src/temp/vm/1-quero-ver/macros/VM_global_library.vm',
          './src/temp/vm/1-quero-ver/mocks/VM_global_mocks.vm',
          './src/temp/vm/1-quero-ver/variables/VM_global_variables.vm',
        ],
      }));
  }

  const tasks = config.themes.map(generate);

  return tasks;
}

function injectCssTask({ themeName = '' }) {
  return gulp
    .src(`./src/temp/vm/${themeName}/*.vm`)
    .pipe(
      gulpInject(gulp.src(`./src/temp/css/themes/${themeName}.css`), {
        transform: function (filePath, file) {
          return file.contents.toString('utf8');
        },
        removeTags: true,
      })
    )
    .pipe(gulp.dest(`./src/temp/vm/${themeName}`));
}

function getInjectCssTask() {
  function generate(themeName = '') {
    return (themeInjectCssTask = () =>
      injectCssTask({
        themeName,
      }));
  }

  const tasks = config.themes.map(generate);

  return tasks;
}

const inlineCSSTasks = getInlineCssTasksByThemes();
const concatTasks = getConcatTasks();
const injectCssTasks = getInjectCssTask();

const buildTask = gulp.series(
  delBuildTask,
  sassTask,
  gulp.parallel(...inlineCSSTasks),
  gulp.parallel(...concatTasks),
  gulp.parallel(...injectCssTasks),
  htmlTask,
  vmTask
);

function watchTask() {
  return gulp.watch(['./src/**/*', '!./src/temp/**/*'], buildTask);
}

exports.default = gulp.series(buildTask, watchTask);
