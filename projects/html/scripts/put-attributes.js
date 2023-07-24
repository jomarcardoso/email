/**
 *
 * @param {HTMLTableElement} el
 */
function setTableAttributes(el) {
  const bgColor = getComputedStyle(el).backgroundColor;

  el.setAttribute('role', 'presentation');
  el.setAttribute('border', '0');
  el.setAttribute('cellpadding', '0');
  el.setAttribute('cellspacing', '0');

  if (!el.hasAttribute('width')) {
    el.setAttribute('width', '100%');
  }

  if (bgColor !== 'inherit' && bgColor !== 'rgba(0, 0, 0, 0)') {
    el.setAttribute('bgcolor', bgColor);
  }
}

function puAttributes() {
  const tables = Array.from(document.querySelectorAll('table') || []);

  tables.forEach(setTableAttributes);
}
