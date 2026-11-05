const carrinhoService = require('../services/carrinho.service');

const ID_MAXIMO = 2147483647; // maior valor do tipo INTEGER no Postgres
const MENSAGEM_ID_INVALIDO = 'produtoId deve ser um número inteiro positivo.';

function ehIdValido(id) {
  return Number.isInteger(id) && id > 0 && id <= ID_MAXIMO;
}

// Parâmetros de rota sempre chegam como texto: "2" vira 2, "abc" ou "2.5" viram NaN.
function converterParametroId(valor) {
  return /^\d+$/.test(valor) ? Number(valor) : NaN;
}

async function listarCarrinhoController(req, res) {
  const carrinho = await carrinhoService.listar();
  return res.status(200).json(carrinho);
}

async function adicionarItemController(req, res) {
  const produtoId = req.body?.produtoId;

  if (!ehIdValido(produtoId)) {
    return res.status(400).json({ mensagem: MENSAGEM_ID_INVALIDO });
  }

  const adicionado = await carrinhoService.adicionar(produtoId);

  if (!adicionado) {
    return res.status(404).json({ mensagem: 'Produto não encontrado.' });
  }

  return res.status(201).json({ mensagem: 'Produto adicionado!' });
}

async function deletarItemController(req, res) {
  const produtoId = converterParametroId(req.params.produtoId);

  if (!ehIdValido(produtoId)) {
    return res.status(400).json({ mensagem: MENSAGEM_ID_INVALIDO });
  }

  const removido = await carrinhoService.remover(produtoId);

  if (!removido) {
    return res.status(404).json({ mensagem: 'Item não encontrado no carrinho.' });
  }

  return res.status(200).json({ mensagem: 'Produto removido!' });
}

async function limparCarrinhoController(req, res) {
  await carrinhoService.limpar();
  return res.status(200).json({ mensagem: 'Carrinho limpo!' });
}

module.exports = {
  listarCarrinhoController,
  adicionarItemController,
  deletarItemController,
  limparCarrinhoController,
};