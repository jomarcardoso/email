const { getThemes, getCommonVmFiles } = require('../gulpfile');

describe('build', () => {
  describe('getThemes', () => {
    it('emtpy folder', () => {
      expect(getThemes('./__tests__/labs/lab-empty/scss/themes')).toMatchObject(
        []
      );
    });

    it('folder with scss themes', () => {
      expect(getThemes('./__tests__/labs/lab-3/scss/themes')).toMatchObject([
        'theme-1',
        'theme-2',
      ]);
    });

    it('folder with scss themes', () => {
      expect(getThemes('./__tests__/labs/lab-3/scss/themes')).toMatchObject([
        'theme-1',
        'theme-2',
      ]);
    });

    it('folder with an invalid scss themes', () => {
      expect(
        getThemes('./__tests__/labs/lab-with-invalid-scss-themes/scss/themes')
      ).toMatchObject(['theme-1', 'theme-2']);
    });

    it('invalid folder', () => {
      expect(getThemes('./__tests__/no-folder')).toMatchObject([]);
    });
  });

  describe('getCommonVmFiles', () => {
    it('invalid folder', () => {
      const result = getCommonVmFiles({
        folderPath: 'invalid-folder',
      });

      expect(result).toMatchObject([]);
    });

    it('folderPath empty', () => {
      const result = getCommonVmFiles({
        folderPath: './__tests__/labs/lab-empty/vm/common',
      });

      expect(result).toMatchObject([]);
    });

    it('folderPath empty but expect subFolder macros', () => {
      const result = getCommonVmFiles({
        folderPath: './__tests__/labs/lab-empty/vm/common',
        folderNames: ['macros'],
      });

      expect(result).toMatchObject([]);
    });

    it('subFolder macros with some-macros.vm', () => {
      const result = getCommonVmFiles({
        folderPath: './__tests__/labs/lab-3/vm/common',
        folderNames: ['macros'],
      });

      expect(result).toMatchObject(['macros/some-macros.vm']);
    });
  });
});
