const gulp = require('gulp');
const gulpSass = require('gulp-sass');
const gulpInlineCss = require('gulp-inline-css');
const fs = require('fs');
const gulpVTL = require('gulp-velocityjs2');
const del = require('del');
const gulpRemoveCode = require('gulp-remove-code');
const gulpHeader = require('gulp-header');
const gulpInject = require('gulp-inject');

function getThemes(src = './src/scss/themes') {
  let themeFiles;

  try {
    themeFiles = fs.readdirSync(src);
  } catch (error) {
    return [];
  }

  const filteredScssFiles = themeFiles.filter((name) => name.includes('.scss'));
  const themeFileNames = filteredScssFiles.map((name) =>
    name.replace('.scss', '')
  );

  return themeFileNames;
}

exports.getThemes = getThemes;

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
    temp: './src/temp',
    dist: './dist',
  },
  themes: [],
};

function getCommonVmFiles({
  folderPath = './src/vm/common',
  folderNames = ['variables', 'mocks', 'macros'],
} = {}) {
  const files = [];

  folderNames.map((folderName) => {
    const fullFolder = `${folderPath}/${folderName}`;

    try {
      const items = fs.readdirSync(fullFolder);
      const filteredFiles = items.filter((item) => item.includes('.vm'));
      const filePaths = filteredFiles.map((file) => `${folderName}/${file}`);
      files.push(...filePaths);
    } catch (error) {}
  });

  return files;
}

const delBuildTask = (folders = []) => del(folders);

function htmlTask({
  src = `${config.paths.vm.temp}/**/*.vm`,
  dest = config.paths.html.dest,
} = {}) {
  return gulp
    .src(src)
    .pipe(
      gulpVTL(undefined, {
        escape: false,
      })
    )
    .pipe(gulp.dest(dest));
}

function vmTask({
  src = `${config.paths.vm.temp}/**/*.vm`,
  dest = config.paths.vm.dest,
} = {}) {
  return gulp
    .src(src)
    .pipe(
      gulpRemoveCode({
        commentStart: '##',
        production: true,
      })
    )
    .pipe(gulp.dest(dest));
}

function sassTask({
  src = './src/scss/**/*.scss',
  dest = './src/temp/css',
} = {}) {
  return gulp
    .src(src)
    .pipe(gulpSass().on('error', gulpSass.logError))
    .pipe(gulp.dest(dest));
}

function inlineCssTask({
  src = config.paths.vm.src,
  extraCss = '',
  dest = config.paths.vm.temp,
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
    .pipe(gulp.dest(dest));
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
        dest: `${config.paths.vm.temp}/${themeName}`,
        src: [config.paths.vm.src, `./src/vm/themes/${themeName}/**/*.vm`],
      }));
  }

  const tasks = config.themes.map(generate);

  return tasks;
}

function concatTask({ folder = '', commonFiles = [] } = {}) {
  const stream = gulp.src(`${folder}/*.vm`);

  commonFiles.forEach((commonFile) => {
    console.log(`${folder}/${commonFile}`);
    stream.pipe(gulpHeader(fs.readFileSync(`${folder}/${commonFile}`, 'utf8')));
  });

  return stream.pipe(gulp.dest(folder));
}

function getConcatTasks() {
  function generate(themeName = '') {
    return (themeConcatTask = () =>
      concatTask({
        folder: `./src/temp/vm/${themeName}`,
        commonFiles: getCommonVmFiles(),
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

exports.default = (() => {
  config.themes = getThemes();
  const inlineCSSTasks = getInlineCssTasksByThemes();
  const concatTasks = getConcatTasks();
  const injectCssTasks = getInjectCssTask();

  const buildTask = gulp.series(
    () => delBuildTask([config.paths.dist, config.paths.temp]),
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

  return gulp.series(buildTask, watchTask);
})();
