const express = require('express');
const { metricsMiddleware } = require('./metrics');
const routerHealth = require('./routes/health.routes');
const routerMetrics = require('./routes/metrics.routes');
const routerCatalogo = require('./routes/catalogo.routes');
const routerCarrinho = require('./routes/carrinho.routes');
const { rotaNaoEncontrada, tratarErros } = require('./middlewares/erros');

const app = express();

// Primeiro de todos, para medir inclusive as requisições que falham antes das rotas.
app.use(metricsMiddleware);
app.use(express.json());

app.use(routerHealth);
app.use(routerMetrics);
app.use(routerCatalogo);
app.use(routerCarrinho);

app.use(rotaNaoEncontrada);
app.use(tratarErros);

module.exports = app;
