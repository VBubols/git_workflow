const carrinhoRepository = require('../repositories/carrinho.repository');
const produtoRepository = require('../repositories/produto.repository');

function formatarItem(item) {
  return {
    produtoId: item.produtoId,
    nome: item.produto.nome,
    preco: Number(item.produto.preco),
    quantidade: item.quantidade,
  };
}

function calcularTotal(itens) {
  const total = itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
  return Math.round(total * 100) / 100;
}

async function listar() {
  const itens = (await carrinhoRepository.listarItens()).map(formatarItem);
  return { itens, total: calcularTotal(itens) };
}

// Retorna false quando o produto não existe no catálogo.
async function adicionar(produtoId) {
  const produto = await produtoRepository.buscarPorId(produtoId);

  if (!produto) {
    return false;
  }

  const item = await carrinhoRepository.buscarPorProdutoId(produtoId);

  if (item) {
    await carrinhoRepository.incrementarQuantidade(produtoId);
  } else {
    await carrinhoRepository.criar(produtoId);
  }

  return true;
}

// Remove uma unidade por vez. Retorna false quando o item não está no carrinho.
async function remover(produtoId) {
  const item = await carrinhoRepository.buscarPorProdutoId(produtoId);

  if (!item) {
    return false;
  }

  if (item.quantidade > 1) {
    await carrinhoRepository.decrementarQuantidade(produtoId);
  } else {
    await carrinhoRepository.remover(produtoId);
  }

  return true;
}

async function limpar() {
  await carrinhoRepository.limpar();
}

module.exports = { listar, adicionar, remover, limpar };