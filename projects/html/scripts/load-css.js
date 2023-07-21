/**
 * Put the content of the CSS in the HTML
 * @param {string[]} files
 */
async function loadCSS(files = []) {
  files.forEach(async (file) => {
    const response = await fetch(`./styles/${file}.css`);
    const css = await response.text();
    const styleTag = document.createElement('style');

    styleTag.innerText = css;
    document.head.insertAdjacentElement('beforeend', styleTag);
    document.body.insertAdjacentElement('afterbegin', styleTag);
  });
}
