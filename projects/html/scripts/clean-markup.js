/**
 *
 * @param {HTMLElement} rootEl
 */
function cleanMarkup(rootEl = document.querySelector('.body')) {
  document.documentElement.innerHTML = rootEl.outerHTML;
}
