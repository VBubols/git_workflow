jest.mock('../../src/repositories/carrinho.repository', () => ({
    listarItens: jest.fn(),
    buscarPorProdutoId: jest.fn(),
    criar: jest.fn(),
    incrementarQuantidade: jest.fn(),
    decrementarQuantidade: jest.fn(),
    remover: jest.fn(),
    limpar: jest.fn(),
  }));
  
  jest.mock('../../src/repositories/produto.repository', () => ({
    buscarPorId: jest.fn(),
  }));
  
  const carrinhoRepository = require('../../src/repositories/carrinho.repository');
  const produtoRepository = require('../../src/repositories/produto.repository');
  const carrinhoService = require('../../src/services/carrinho.service');
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('listar', () => {
    test('retorna itens vazios e total 0 com o carrinho vazio', async () => {
      carrinhoRepository.listarItens.mockResolvedValue([]);
  
      await expect(carrinhoService.listar()).resolves.toEqual({ itens: [], total: 0 });
    });
  
    test('formata os itens e converte o preço que vem do banco como texto', async () => {
      carrinhoRepository.listarItens.mockResolvedValue([
        { id: 1, produtoId: 2, quantidade: 2, produto: { nome: 'Mouse', preco: '80.00' } },
        { id: 2, produtoId: 1, quantidade: 1, produto: { nome: 'Teclado', preco: '150.00' } },
      ]);
  
      await expect(carrinhoService.listar()).resolves.toEqual({
        itens: [
          { produtoId: 2, nome: 'Mouse', preco: 80, quantidade: 2 },
          { produtoId: 1, nome: 'Teclado', preco: 150, quantidade: 1 },
        ],
        total: 310,
      });
    });
  
    test('arredonda o total para duas casas decimais', async () => {
      carrinhoRepository.listarItens.mockResolvedValue([
        { id: 1, produtoId: 7, quantidade: 3, produto: { nome: 'Cabo', preco: '0.10' } },
      ]);
  
      const { total } = await carrinhoService.listar();
  
      expect(total).toBe(0.3);
    });
  });
  
  describe('adicionar', () => {
    test('retorna false e não mexe no carrinho quando o produto não existe', async () => {
      produtoRepository.buscarPorId.mockResolvedValue(null);
  
      await expect(carrinhoService.adicionar(99)).resolves.toBe(false);
      expect(carrinhoRepository.criar).not.toHaveBeenCalled();
      expect(carrinhoRepository.incrementarQuantidade).not.toHaveBeenCalled();
    });
  
    test('cria o item quando o produto ainda não está no carrinho', async () => {
      produtoRepository.buscarPorId.mockResolvedValue({ id: 2, nome: 'Mouse', preco: '80.00' });
      carrinhoRepository.buscarPorProdutoId.mockResolvedValue(null);
  
      await expect(carrinhoService.adicionar(2)).resolves.toBe(true);
      expect(carrinhoRepository.criar).toHaveBeenCalledWith(2);
      expect(carrinhoRepository.incrementarQuantidade).not.toHaveBeenCalled();
    });
  
    test('incrementa a quantidade quando o produto já está no carrinho', async () => {
      produtoRepository.buscarPorId.mockResolvedValue({ id: 2, nome: 'Mouse', preco: '80.00' });
      carrinhoRepository.buscarPorProdutoId.mockResolvedValue({ id: 1, produtoId: 2, quantidade: 1 });
  
      await expect(carrinhoService.adicionar(2)).resolves.toBe(true);
      expect(carrinhoRepository.incrementarQuantidade).toHaveBeenCalledWith(2);
      expect(carrinhoRepository.criar).not.toHaveBeenCalled();
    });
  });
  
  describe('remover', () => {
    test('retorna false quando o item não está no carrinho', async () => {
      carrinhoRepository.buscarPorProdutoId.mockResolvedValue(null);
  
      await expect(carrinhoService.remover(3)).resolves.toBe(false);
      expect(carrinhoRepository.remover).not.toHaveBeenCalled();
      expect(carrinhoRepository.decrementarQuantidade).not.toHaveBeenCalled();
    });
  
    test('decrementa a quantidade quando há mais de uma unidade', async () => {
      carrinhoRepository.buscarPorProdutoId.mockResolvedValue({ id: 1, produtoId: 2, quantidade: 3 });
  
      await expect(carrinhoService.remover(2)).resolves.toBe(true);
      expect(carrinhoRepository.decrementarQuantidade).toHaveBeenCalledWith(2);
      expect(carrinhoRepository.remover).not.toHaveBeenCalled();
    });
  
    test('remove o item quando resta apenas uma unidade', async () => {
      carrinhoRepository.buscarPorProdutoId.mockResolvedValue({ id: 1, produtoId: 2, quantidade: 1 });
  
      await expect(carrinhoService.remover(2)).resolves.toBe(true);
      expect(carrinhoRepository.remover).toHaveBeenCalledWith(2);
      expect(carrinhoRepository.decrementarQuantidade).not.toHaveBeenCalled();
    });
  });
  
  describe('limpar', () => {
    test('esvazia o carrinho pelo repository', async () => {
      await carrinhoService.limpar();
  
      expect(carrinhoRepository.limpar).toHaveBeenCalledTimes(1);
    });
  });