const express = require("express");
const routerCarrinho = require("./routes/carrinho.routes");
const routerCatalogo = require("./routes/catalogo.routes");

const app = express();
app.use(express.json());

app.use('/', routerCarrinho);
app.use('/', routerCatalogo);

const port = 3000;
app.listen(port, () => {
    console.log(`Rodando servidor na porta: ${port}`);
});
