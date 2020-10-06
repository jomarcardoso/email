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

Adicionais

- fake smtp
- extensões do vs code
  -