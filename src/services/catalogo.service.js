const produtoRepository = require('../repositories/produto.repository');

// O Postgres devolve DECIMAL como string; a API sempre responde o preço como número.
function formatarProduto(produto) {
  return {
    id: produto.id,
    nome: produto.nome,
    preco: Number(produto.preco),
  };
}

async function listar() {
  const produtos = await produtoRepository.listarTodos();
  return produtos.map(formatarProduto);
}

module.exports = { listar };
