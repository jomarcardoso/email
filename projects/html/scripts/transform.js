function camelize(str = '') {
  let arr = str.split('-');
  let capital = arr.map((item, index) =>
    index
      ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
      : item.toLowerCase()
  );
  // ^-- change here.
  let capitalString = capital.join('');

  return capitalString;
}

/**
 * Run this before CSS to save the browser styles to filter.
 * @param {string[]} tags
 */
function getBasicStyles(tags = []) {
  const templateTag = document.createElement('template');

  document.body.insertAdjacentElement('beforeend', templateTag);

  return tags.reduce((obj, tag) => {
    const el = document.createElement(tag);

    templateTag.insertAdjacentElement('beforeend', el);

    const styles = getComputedStyle(el);

    return {
      ...obj,
      [tag]: Array.from(styles).reduce(
        (obj2, key) => ({
          ...obj2,
          [key]: styles.getPropertyValue(key),
        }),
        {}
      ),
    };
  }, {});
}

const DEFAULT_TAG_PROPERTIES = getBasicStyles([
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'DIV',
  'TABLE',
  'TR',
  'TD',
  'TH',
  'P',
  'A',
  'IMG',
  'SPAN',
  'HEADER',
  'BODY',
  'HTML',
  'HR',
  'B',
  'STRONG',
  'EM',
  'FONT',
  'UL',
  'OL',
  'LI',
  'SMALL',
]);

const PROPERTIES_TO_IGNORE = [
  'perspective-origin',
  'transform-origin',
  'inline-size',
  'block-size',
  'view-transition-name',
  'accent-color',
  'zoom',
  // 'margin-block',
  // 'margin-block-end',
  // 'margin-block-start',
  'margin-inline',
  'margin-inline-end',
  'margin-inline-start',
  'min-inline-size',
  'border-block-color',
  'border-inline-color',
  // 'padding-block',
  // 'padding-block-end',
  // 'padding-block-start',
  // 'padding-inline',
  // 'padding-inline-end',
  // 'padding-inline-start',
  '-webkit-text-fill-color',
  '-webkit-text-stroke-color',
  'text-emphasis-color',
  'column-rule-color',
  'border-inline-color',
  'border-inline-start-color',
  'border-inline-end-color',
  'border-block-color',
  'border-block-start-color',
  'border-block-end-color',
  'outline-color',
  'caret-color',
  'text-size-adjust',
  'max-inline-size',
  'max-inline-start-size',
  'max-inline-end-size',
];

/**
 *
 * @param {HTMLElement} el
 */
function getAppliedCSS(el) {
  const styles = getComputedStyle(el);
  const stylesArray = Array.from(styles);
  const defaultProperties = DEFAULT_TAG_PROPERTIES[el.tagName];

  return stylesArray
    .filter((key) => {
      if (!defaultProperties || PROPERTIES_TO_IGNORE.includes(key)) {
        return false;
      }

      const defaultValue = defaultProperties[key];
      const styleValue = styles.getPropertyValue(key);

      if ((key === 'height' || key === 'width') && styleValue.includes('.')) {
        return false;
      }

      return defaultValue !== styleValue;
    })
    .reduce(
      (obj, key) => ({ ...obj, [key]: styles.getPropertyValue(key) }),
      {}
    );
}

/**
 * Check every element if it has applied CSS to put inline.
 * @param {HTMLElement[]} els
 */
function applyCSSstyles(els = []) {
  els.forEach((el) => {
    const styles = getAppliedCSS(el);

    Object.entries(styles).forEach(([key, value]) => {
      el.style[camelize(key)] = value;
    });
  });
}
