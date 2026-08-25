const catalogo = [
  { nome: "Teclado", preco: 150.0 },
  { nome: "Mouse", preco: 80.0 },
  { nome: "Monitor", preco: 900.0 },
  { nome: "Gabinete", preco: 120.0 },
  { nome: "Headset", preco: 320.0 },
  { nome: "Cadeira Gamer", preco: 540.0 },
];

const carrinho = [];

function adicionarItem(nome, preco, quantidade = 1) {
  carrinho.push({ nome, preco, quantidade });
  console.log(`Adicionado ao carrinho item: ${nome}`);
}

function deletarItem(nome) {
    const index = carrinho.findIndex(item => item.nome === nome);
    carrinho.splice(index, 1);
    console.log(`Removido item do carrinho: ${nome}`);
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
deletarItem("Teclado");
listarCarrinho();