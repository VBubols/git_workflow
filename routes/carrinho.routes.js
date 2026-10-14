const express = require("express");
const routerCarrinho = express.router();

const {
    listarCarrinhoController,
    limparCarrinhoController,
    adicionarItemController,
    deletarItemController
} = require("../controllers/carrinho.controller.js");

routerCarrinho.get('/carrinho', listarCarrinhoController);
routerCarrinho.delete('/carrinho', limparCarrinhoController);
routerCarrinho.post('/carrinho', adicionarItemController);
routerCarrinho.delete('/carrinho/:nome', deletarItemController);

module.exports = routerCarrinho;