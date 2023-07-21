const gulp = require('gulp');
const gulpSass = require('gulp-sass');
const gulpInlineCss = require('gulp-inline-css');
const fs = require('fs');
const gulpVTL = require('gulp-velocityjs2');
const del = require('del');
const gulpRemoveCode = require('gulp-remove-code');
const gulpHeader = require('gulp-header');
const gulpInject = require('gulp-inject');

const config = {
  paths: {
    vm: {
      src: './src/vm',
      temp: './temp/vm',
      dest: './dist/vm',
    },
    css: {
      src: './src/scss',
      dest: './temp/css',
    },
    vmInlineCss: {
      dest: './dist',
    },
    html: {
      dest: './dist/html',
    },
    src: './src',
    temp: './temp',
    dest: './dist',
  },
  themes: [],
};

function getThemes(src = `${config.paths.css.src}/themes`) {
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

function getCommonVmFiles({
  folderPath = `${config.paths.vm.src}/common`,
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

const delBuildTask = () =>
  ((folders = [config.paths.dest, config.paths.temp]) => del(folders))();

function viewHtmlSampleTask({
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

function distributionSourceVmTask({
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
  src = `${config.paths.css.src}/**/*.scss`,
  dest = config.paths.css.dest,
} = {}) {
  return gulp
    .src(src)
    .pipe(gulpSass().on('error', gulpSass.logError))
    .pipe(gulp.dest(dest));
}

function inlineCssTask({
  src = `${config.paths.vm.src}/common/**/*.vm`,
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
        extraCss: getCssContentBySrc(
          `${config.paths.css.dest}/themes/${themeName}.css`
        ),
        dest: `${config.paths.vm.temp}/${themeName}`,
        src: [
          `${config.paths.vm.src}/common/**/*.vm`,
          `${config.paths.vm.src}/themes/${themeName}/**/*.vm`,
        ],
      }));
  }

  const tasks = config.themes.map(generate);

  return tasks;
}

function injectMacroTask({ folder = '', commonFiles = [] } = {}) {
  const stream = gulp.src(`${folder}/*.vm`);

  commonFiles.forEach((commonFile) => {
    try {
      stream.pipe(
        gulpHeader(fs.readFileSync(`${folder}/${commonFile}`, 'utf8'))
      );
    } catch (error) {}
  });

  return stream.pipe(gulp.dest(folder));
}

function getInjectMacrosTasks() {
  function generate(themeName = '') {
    return (themeConcatTask = () =>
      injectMacroTask({
        folder: `${config.paths.vm.temp}/${themeName}`,
        commonFiles: getCommonVmFiles(),
      }));
  }

  const tasks = config.themes.map(generate);

  return tasks;
}

function injectStyleTagTask({ themeName = '' }) {
  return gulp
    .src(`${config.paths.vm.temp}/${themeName}/*.vm`)
    .pipe(
      gulpInject(gulp.src(`${config.paths.css.dest}/themes/${themeName}.css`), {
        transform: function (filePath, file) {
          return file.contents.toString('utf8');
        },
        removeTags: true,
      })
    )
    .pipe(gulp.dest(`${config.paths.vm.temp}/${themeName}`));
}

function getInjectStyleTagTask() {
  function generate(themeName = '') {
    return (themeInjectCssTask = () =>
      injectStyleTagTask({
        themeName,
      }));
  }

  const tasks = config.themes.map(generate);

  return tasks;
}

exports.getThemes = getThemes;
exports.getCommonVmFiles = getCommonVmFiles;
exports.delBuild = delBuildTask;

exports.default = (() => {
  config.themes = getThemes();
  const inlineCSSTasks = getInlineCssTasksByThemes();
  const injectMacrosTasks = getInjectMacrosTasks();
  const injectStyleTagTasks = getInjectStyleTagTask();

  const buildTask = gulp.series(
    delBuildTask,
    sassTask,
    gulp.parallel(...inlineCSSTasks),
    gulp.parallel(...injectMacrosTasks),
    gulp.parallel(...injectStyleTagTasks),
    viewHtmlSampleTask,
    distributionSourceVmTask
  );

  function watchTask() {
    return gulp.watch(`${config.paths.src}/**/*`, buildTask);
  }

  return gulp.series(buildTask, watchTask);
})();
