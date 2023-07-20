# Creating accessible compatible emails

- [Reset CSS](#reset-css)
- [Boilerplate in Velocity](#boilerplate)

## <a name="reset-css"></a> Reset CSS

<details>
  <summary>show commented code</summary>

```css
body {
  margin: 0;
  padding: 0;
  min-width: 100%;
}

img {
  /* for images not loaded */
  border: 0 none;
  height: auto;
  line-height: 100%;
  outline: none;
  text-decoration: none;
}

a img {
  border: 0 none;
}

/* reset table to use for structuring the page */
table {
  border-spacing: 0;
  border-collapse: collapse;
}

/* reset table to use for structuring the page */
td {
  padding: 0;
  text-align: left;
  word-break: break-word;
  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  hyphens: auto;
  border-collapse: collapse !important;
}

body,
table,
td,
p,
a,
li,
blockquote {
  -webkit-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
}

/* specific clientes */
/* https://templates.mailchimp.com/development/css/client-specific-styles/ */
/* https://www.htmlemailcheck.com/knowledge-base/recommended-externalclass-css-fix-outlook-com/ */

/* ### Outlook.com / Hotmail */

/*
.ExternalClass Class Override

By default, Outlook.com centers your email by placing it inside a div with a class named “ExternalClass” using the styles display:inline-block; line-height: 131%. These have no effect when using IE, however in every other browser, the email will not be centered.

To overwrite these styles and a number of additional fixes simply include the following CSS .ExternalClass within the <head></head> of your emails HTML

*/
.ExternalClass {
  width: 100%;
}

/*
When an email is pulled into Outlook.com / Hotmail, any style rules present in the email are appended with .ExternalClass. Normalizing a few of these can help create a baseline for you to work from.
*/
.ExternalClass,
.ExternalClass p,
.ExternalClass span,
.ExternalClass font,
.ExternalClass td,
.ExternalClass div {
  line-height: 100%;
}

/*
<hX> Color Override

Outlook.com / Hotmail sets its own (gross green) color on heading elements lower in level than an <h1> element. This means you need to account for headings <h2> through <h6>. Fortunately, it’s as easy as applying a !important declaration to the heading’s color property:

I think it's not necesary
h2 {
  color:#0066CC !important;
}
*/

/* https://github.com/seanpowell/Email-Boilerplate/issues/10 */
.ReadMsgBody {
  width: 100%;
}

/* Outlook 2007 / 2010 / 2013 */

/*
“Read in Browser” Link

It’s possible, in Outlook, to trigger the appearance of a fairly prominent “View this email in your browser” bar within the application, allowing you to drive people to view your email in a browser which will render it in a much better way than Outlook ever can.
*/
#outlook a {
  padding: 0;
}

/*
<table> Element Spacing

Outlook can sometimes add a bit of spacing on the left and right side of a <table> element that can cause some layout-related headaches. By using the vendor-specific mso-table-lspace and mso-table-rspace CSS properties, you can be rid of those spaces and continue on to tackle the million other problems caused by Outlook.
*/
table,
td {
  mso-table-lspace: 0pt;
  mso-table-rspace: 0pt;
}

/*
Image Resizing

Using width or height tags to resize images in your markup can create a problem in Internet Explorer browsers. If your reader is viewing an email in-browser, and that email happens to have fluid images in it, they’ll look pretty ugly as they resize. Using -ms-interpolation-mode:bicubic; ensures that your images look a little better.
*/
img,
a img {
  -ms-interpolation-mode: bicubic;
}

/* ### OSX / iOS */

/*
WebKit Text Size Adjustment

WebKit looks for any text that happens to be sized smaller than 13px and increases it to that number, which can sometimes cause design issues in places intended for small text. Setting -webkit-text-size-adjust to none will prevent iOS platforms from resizing the text, but this method also prevents OSX applications like Safari from bumping the text size up - something that can cause issues for people who need the text size to be large. Setting -webkit-text-size-adjust to 100% seems to be the best of both worlds.
*/
body {
  -webkit-text-size-adjust: 100%;
}

a[x-apple-data-detectors] {
  color: inherit;
  text-decoration: none;
  font-size: inherit;
  font-family: inherit;
  font-weight: inherit;
  line-height: inherit;
}

/* ### Windows Mobile */

/*
Windows Mobile Text Size Adjustment

Much like in OSX and iOS, small text is also resized on Windows Mobile. The same vendor-prefix-based CSS property is used here, just with the ms vendor prefix instead of the webkit one.
*/
body {
  -ms-text-size-adjust: 100%;
}

/* ### Android */

div[style*='margin: 16px 0;'] {
  margin: 0;
}
```

</details>

## <a name="reset-css"></a> Structure with table

## <a name="reset-css"></a> Accessibility

## <a name="boilerplate"></a> Boilerplate in Velocity

### CSS

O CSS dos clientes de email são limitados. Como referência usamos o site [https://www.campaignmonitor.com/css/](https://www.campaignmonitor.com/css/).

Algumas limitações;

- layout com tabelas;
- css em linha;

A forma adotada é:

- usar Sass
- pegar as classes e injetar o css delas nos elementos

### Boas práticas

Não importar mais de uma variável em um parse.

Ao lado de um `#parse` colocar em comentário a variável sendo importada.

Comentário nas primeiras linhas descrevendo o email.

Para adicionar telefones `<a href="tel:1-800-555-5555">1-808-555-5555</a>`

### Regras

- CSS Inline (feito pela ferramenta)
- `<table>` para layout
- `<div>` não funciona padding e max-width

### Material adicional

- [MUICSS - HTML Email](https://www.muicss.com/docs/v1/email/boilerplate-html)
- fake smtp
- https://templates.mailchimp.com/
- https://emailframe.work/

- ### extensões do vs code

...
