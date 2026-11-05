const { Produto } = require('../models');

const produtos = [
  { nome: 'Teclado', preco: 150.0 },
  { nome: 'Mouse', preco: 80.0 },
  { nome: 'Monitor', preco: 900.0 },
  { nome: 'Gabinete', preco: 120.0 },
  { nome: 'Headset', preco: 320.0 },
  { nome: 'Cadeira Gamer', preco: 540.0 },
];

async function popularProdutos() {
  const total = await Produto.count();

  if (total > 0) {
    return;
  }

  await Produto.bulkCreate(produtos);
}

module.exports = { popularProdutos };