const carrinho = [];

function adicionarItem(nome, preco, quantidade = 1) {
  carrinho.push({ nome, preco, quantidade });
}

function calcularTotal() {
  return carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
}

function listarCarrinho() {
  carrinho.forEach(item => {
    console.log(`${item.nome} x${item.quantidade} = R$ ${(item.preco * item.quantidade).toFixed(2)}`);
  });
  console.log(`Total: R$ ${calcularTotal().toFixed(2)}`);
}

adicionarItem("Teclado", 150.00);
adicionarItem("Mouse", 80.00, 2);
listarCarrinho();