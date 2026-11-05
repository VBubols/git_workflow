const express = require('express');
const {
  listarCarrinhoController,
  adicionarItemController,
  deletarItemController,
  limparCarrinhoController,
} = require('../controllers/carrinho.controller');

const routerCarrinho = express.Router();

routerCarrinho.get('/carrinho', listarCarrinhoController);
routerCarrinho.post('/carrinho', adicionarItemController);
routerCarrinho.delete('/carrinho/:produtoId', deletarItemController);
routerCarrinho.delete('/carrinho', limparCarrinhoController);

module.exports = routerCarrinho;