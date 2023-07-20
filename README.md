# Creating accessible compatible emails

- [Reset CSS](#reset-css)
- [Boilerplate in Velocity](#boilerplate)

## <a name="reset-css"></a> Reset CSS

<detail>
  <summary>show commented code</summary>

```css
body {
  margin: 0;
  padding: 0;
  min-width: 100%;
}

img {
  border: 0 none;
  height: auto;
  line-height: 100%;
  outline: none;
  text-decoration: none;
}

a img {
  border: 0 none;
}

table {
  border-spacing: 0;
  border-collapse: collapse;
}

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

/* Outlook.com / Hotmail */

.ExternalClass {
  width: 100%;
}

.ExternalClass,
.ExternalClass p,
.ExternalClass span,
.ExternalClass font,
.ExternalClass td,
.ExternalClass div {
  line-height: 100%;

  // h2{
  //   color:#0066CC !important;
  // }
}

.ReadMsgBody {
  width: 100%;
}

/* Outlook 2007 / 2010 / 2013 */

#outlook a {
  padding: 0;
}

table,
td {
  mso-table-lspace: 0pt;
  mso-table-rspace: 0pt;
}

img,
a img {
  -ms-interpolation-mode: bicubic;
}

/* OSX / iOS */

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

/* Windows Mobile */

body {
  -ms-text-size-adjust: 100%;
}

/* android */

div[style*='margin: 16px 0;'] {
  margin: 0;
}
```

</detail>

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
