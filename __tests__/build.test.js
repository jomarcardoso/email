const { getThemes } = require('../gulpfile');

describe('build', () => {
  describe('getThemes', () => {
    it('emtpy folder', () => {
      expect(getThemes('./__tests__/labs/lab-empty/scss/themes')).toMatchObject(
        []
      );
    });

    it('folder with scss themes', () => {
      expect(
        getThemes('./__tests__/labs/lab-with-scss-themes/scss/themes')
      ).toMatchObject(['theme-1', 'theme-2']);
    });

    it('folder with scss themes', () => {
      expect(
        getThemes('./__tests__/labs/lab-with-scss-themes/scss/themes')
      ).toMatchObject(['theme-1', 'theme-2']);
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
});
