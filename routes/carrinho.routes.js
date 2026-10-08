const express = require("express");
const router = express.Router();

const {
    listarCarrinhoController,
    limparCarrinhoController,
    adicionarItemController,
    deletarItemController
} = require("../controllers/carrinho.controller.js");

router.get('/carrinho', listarCarrinhoController);
router.delete('/carrinho', limparCarrinhoController);
router.post('/carrinho', adicionarItemController);
router.delete('/carrinho/:nome', deletarItemController);

module.exports = router;