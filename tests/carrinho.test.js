const {
  obterCarrinho,
  limparCarrinho,
  adicionarItem,
  deletarItem,
  calcularTotal,
  listarCarrinho,
} = require("../src/carrinho");

// Silencia o console e permite inspecionar o que foi impresso.
let logSpy;

beforeEach(() => {
  limparCarrinho();
  logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  logSpy.mockRestore();
});

describe("adicionarItem", () => {
  test("adiciona produto novo com quantidade 1", () => {
    adicionarItem(0);

    expect(obterCarrinho()).toHaveLength(1);
    expect(obterCarrinho()[0]).toEqual({
      nome: "Teclado",
      preco: 150.0,
      quantidade: 1,
    });
  });

  test("incrementa a quantidade em vez de duplicar a entrada", () => {
    adicionarItem(1);
    adicionarItem(1);
    adicionarItem(1);

    expect(obterCarrinho()).toHaveLength(1);
    expect(obterCarrinho()[0].quantidade).toBe(3);
  });

  test("mantém produtos diferentes em entradas separadas", () => {
    adicionarItem(0);
    adicionarItem(2);

    expect(obterCarrinho()).toHaveLength(2);
    expect(obterCarrinho().map((i) => i.nome)).toEqual(["Teclado", "Monitor"]);
  });

  test("rejeita índice fora do catálogo sem alterar o carrinho", () => {
    const resultado = adicionarItem(99);

    expect(resultado).toBe(false);
    expect(obterCarrinho()).toHaveLength(0);
    expect(logSpy).toHaveBeenCalledWith("Produto não existente.");
  });

  test("rejeita índice negativo", () => {
    expect(adicionarItem(-1)).toBe(false);
    expect(obterCarrinho()).toHaveLength(0);
  });

  test("não altera o objeto original do catálogo", () => {
    const catalogo = require("../src/catalogo");

    adicionarItem(0);
    obterCarrinho()[0].quantidade = 10;

    expect(catalogo[0]).not.toHaveProperty("quantidade");
  });
});

describe("deletarItem", () => {
  test("decrementa a quantidade quando há mais de uma unidade", () => {
    adicionarItem(1);
    adicionarItem(1);

    deletarItem("Mouse");

    expect(obterCarrinho()).toHaveLength(1);
    expect(obterCarrinho()[0].quantidade).toBe(1);
  });

  test("remove a entrada quando resta apenas uma unidade", () => {
    adicionarItem(1);

    deletarItem("Mouse");

    expect(obterCarrinho()).toHaveLength(0);
  });

  test("encontra o item ignorando maiúsculas e minúsculas", () => {
    adicionarItem(5);

    expect(deletarItem("cadeira gamer")).toBe(true);
    expect(obterCarrinho()).toHaveLength(0);
  });

  test("não remove nada quando o item não existe", () => {
    adicionarItem(0);
    adicionarItem(2);

    const resultado = deletarItem("Webcam");

    expect(resultado).toBe(false);
    expect(obterCarrinho()).toHaveLength(2);
    expect(logSpy).toHaveBeenCalledWith("Item não encontrado.");
  });

  test("não remove o último item ao buscar nome inexistente (guarda do splice(-1))", () => {
    adicionarItem(0);
    adicionarItem(2);

    deletarItem("Inexistente");

    expect(obterCarrinho().map((i) => i.nome)).toEqual(["Teclado", "Monitor"]);
  });

  test("funciona com o carrinho vazio", () => {
    expect(deletarItem("Teclado")).toBe(false);
    expect(obterCarrinho()).toHaveLength(0);
  });
});

describe("calcularTotal", () => {
  test("retorna 0 com o carrinho vazio", () => {
    expect(calcularTotal()).toBe(0);
  });

  test("soma preço vezes quantidade de cada item", () => {
    adicionarItem(0); // Teclado 150
    adicionarItem(1); // Mouse 80
    adicionarItem(1); // Mouse 80

    expect(calcularTotal()).toBe(310);
  });

  test("reflete a remoção de itens", () => {
    adicionarItem(2); // Monitor 900
    adicionarItem(0); // Teclado 150
    deletarItem("Monitor");

    expect(calcularTotal()).toBe(150);
  });
});

describe("listarCarrinho", () => {
  test("avisa quando o carrinho está vazio", () => {
    listarCarrinho();

    expect(logSpy).toHaveBeenCalledWith("Carrinho vazio.");
  });

  test("imprime uma linha por item e o total ao final", () => {
    adicionarItem(0);
    adicionarItem(1);
    logSpy.mockClear(); // descarta os logs de "adicionado"

    listarCarrinho();

    expect(logSpy).toHaveBeenCalledWith("Teclado x1 = R$ 150.00");
    expect(logSpy).toHaveBeenCalledWith("Mouse x1 = R$ 80.00");
    expect(logSpy).toHaveBeenLastCalledWith("Total: R$ 230.00");
  });

  test("formata o subtotal com duas casas decimais", () => {
    adicionarItem(3); // Gabinete 120
    adicionarItem(3);
    logSpy.mockClear();

    listarCarrinho();

    expect(logSpy).toHaveBeenCalledWith("Gabinete x2 = R$ 240.00");
  });
});
