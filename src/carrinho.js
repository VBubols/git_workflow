const catalogo = require("./catalogo");

let carrinho = [];

function obterCarrinho() {
  return carrinho;
}

function limparCarrinho() {
  carrinho = [];
}

function adicionarItem(indice) {
  const produto = catalogo[indice];

  if (!produto) {
    console.log("Produto não existente.");
    return false;
  }

  const existente = carrinho.find((i) => i.nome === produto.nome);

  if (existente) {
    existente.quantidade++;
  } else {
    carrinho.push({ ...produto, quantidade: 1 });
  }

  console.log(`${produto.nome} adicionado.`);
  return true;
}

function deletarItem(nome) {
  const indice = carrinho.findIndex(
    (i) => i.nome.toLowerCase() === nome.toLowerCase()
  );

  if (indice === -1) {
    console.log("Item não encontrado.");
    return false;
  }

  if (carrinho[indice].quantidade > 1) {
    carrinho[indice].quantidade--;
  } else {
    carrinho.splice(indice, 1);
  }

  console.log("Removido.");
  return true;
}

function calcularTotal() {
  return carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
}

function listarCarrinho() {
  if (carrinho.length === 0) {
    console.log("Carrinho vazio.");
    return;
  }

  carrinho.forEach((item) => {
    console.log(
      `${item.nome} x${item.quantidade} = R$ ${(
        item.preco * item.quantidade
      ).toFixed(2)}`
    );
  });

  console.log(`Total: R$ ${calcularTotal().toFixed(2)}`);
}

module.exports = {
  obterCarrinho,
  limparCarrinho,
  adicionarItem,
  deletarItem,
  calcularTotal,
  listarCarrinho,
};
