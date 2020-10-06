# Emails

## CSS

O CSS dos clientes de email são limitados. Como referência usamos o site [https://www.campaignmonitor.com/css/](https://www.campaignmonitor.com/css/).

Algumas limitações;

- layout com tabelas;
- css em linha;

A forma adotada é:

- usar Sass
- pegar as classes e injetar o css delas nos elementos

## Boas práticas

Não importar mais de uma variável em um parse.

Ao lado de um `#parse` colocar em comentário a variável sendo importada.

Comentário nas primeiras linhas descrevendo o email.

Para adicionar telefones `<a href="tel:1-800-555-5555">1-808-555-5555</a>`

## Regras

- CSS Inline (feito pela ferramenta)
- `<table>` para layout
- `<div>` não funciona padding e max-width

## Material adicional

- [MUICSS - HTML Email](https://www.muicss.com/docs/v1/email/boilerplate-html)
- fake smtp
- https://templates.mailchimp.com/
- https://emailframe.work/

- ## extensões do vs code
