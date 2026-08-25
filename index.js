const catalogo = [
  { nome: "Teclado", preco: 150.0 },
  { nome: "Mouse", preco: 80.0 },
  { nome: "Monitor", preco: 900.0 },
  { nome: "Gabinete", preco: 120.0 },
  { nome: "Headset", preco: 320.0 },
  { nome: "Cadeira Gamer", preco: 540.0 },
];

const carrinho = [];

function adicionarItem(indice) {
  const produto = catalogo[indice];
  if(!produto) {
    console.log("Produto não existente.")
    return
  } 
  const existente = carrinho.find((i) => i.nome === produto.nome);
  if (existente) {
    existente.quantidade++;
  } else {
    carrinho.push({ ...produto, quantidade: 1 });
  }
  console.log(`${produto.nome} adicionado.`);
}

function deletarItem(nome) {
  const indice = carrinho.findIndex((i) => i.nome.toLowerCase() === nome.toLowerCase());
  if (indice === -1) {
    console.log("Item não encontrado.");
    return;
  }
  if (carrinho[indice].quantidade > 1) {
    carrinho[indice].quantidade--;
  } else {
    carrinho.splice(indice, 1);
  }
  console.log("Removido.");
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

adicionarItem(1);
adicionarItem(1);
adicionarItem(2);
deletarItem("mouse")
listarCarrinho();