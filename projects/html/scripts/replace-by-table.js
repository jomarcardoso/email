/**
 *
 * @param {HTMLElement} el
 * @param {HTMLElement['tagName']} tagName
 */
function replaceBy(el, tagName = 'table') {
  const { innerHTML, style, attributes, className } = el;
  const newTag = document.createElement(tagName);

  Array.from(attributes).forEach((attribute) => {
    newTag.attributes.setNamedItem(attribute.cloneNode());
  });
  newTag.className = className;
  newTag.style = style;
  newTag.insertAdjacentHTML('afterbegin', innerHTML);

  if (tagName === 'td' && el.parentNode.tagName !== 'TR') {
    const tr = document.createElement('tr');

    tr.insertAdjacentElement('afterbegin', newTag);
    el.parentNode.replaceChild(tr, el);

    return;
  }

  if (tagName === 'tr' && el.parentNode.tagName !== 'TABLE') {
    const table = document.createElement('table');

    table.insertAdjacentElement('afterbegin', newTag);
    el.parentNode.replaceChild(table, el);

    return;
  }

  el.parentNode.replaceChild(newTag, el);
}

function putInsideTD() {
  const firstContent = document.querySelector('tr > img');

  console.log(firstContent);

  if (!firstContent) {
    return;
  }

  const parent = firstContent.parentNode;
  const td = document.createElement('td');
  const html = firstContent.outerHTML;

  td.insertAdjacentHTML('afterbegin', html);
  parent.replaceChild(td, firstContent);
  putInsideTD();
}

function replaceByTable() {
  const firstDiv = document.querySelector('div, header, section, main, footer');

  if (!firstDiv) {
    putInsideTD();

    return;
  }

  const styles = getComputedStyle(firstDiv);
  const display = styles.getPropertyValue('display');

  console.log(firstDiv.tagName, firstDiv.parentNode.tagName, display);

  if (display === 'flex') {
    replaceBy(firstDiv, 'tr');
    replaceByTable();

    return;
  }

  replaceBy(firstDiv, 'td');
  replaceByTable();
}
