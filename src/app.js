const express = require('express');
const routerHealth = require('./routes/health.routes');
const routerCatalogo = require('./routes/catalogo.routes');
const routerCarrinho = require('./routes/carrinho.routes');
const { rotaNaoEncontrada, tratarErros } = require('./middlewares/erros');

const app = express();

app.use(express.json());

app.use(routerHealth);
app.use(routerCatalogo);
app.use(routerCarrinho);

app.use(rotaNaoEncontrada);
app.use(tratarErros);

module.exports = app;