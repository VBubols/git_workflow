const { ItemCarrinho, Produto } = require('../models');

async function listarItens() {
  const itens = await ItemCarrinho.findAll({
    include: { model: Produto, as: 'produto', attributes: ['nome', 'preco'] },
    order: [['id', 'ASC']],
  });

  return itens.map((item) => item.get({ plain: true }));
}

async function buscarPorProdutoId(produtoId) {
  return ItemCarrinho.findOne({ where: { produtoId }, raw: true });
}

async function criar(produtoId) {
  const item = await ItemCarrinho.create({ produtoId });
  return item.get({ plain: true });
}

async function incrementarQuantidade(produtoId) {
  await ItemCarrinho.increment('quantidade', { by: 1, where: { produtoId } });
}

async function decrementarQuantidade(produtoId) {
  await ItemCarrinho.decrement('quantidade', { by: 1, where: { produtoId } });
}

async function remover(produtoId) {
  await ItemCarrinho.destroy({ where: { produtoId } });
}

async function limpar() {
  await ItemCarrinho.destroy({ where: {} });
}

module.exports = {
  listarItens,
  buscarPorProdutoId,
  criar,
  incrementarQuantidade,
  decrementarQuantidade,
  remover,
  limpar,
};