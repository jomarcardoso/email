/**
 *
 * @param {HTMLElement} rootEl
 */
function cleanMarkup() {
  // document.documentElement.innerHTML = rootEl.outerHTML;
  Array.from(document.querySelectorAll('script')).forEach((el) => el.remove());
  // document.querySelector('head').remove();
}
