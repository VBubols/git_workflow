jest.mock('../../src/repositories/produto.repository', () => ({
  listarTodos: jest.fn(),
}));

const produtoRepository = require('../../src/repositories/produto.repository');
const catalogoService = require('../../src/services/catalogo.service');

test('lista os produtos com o preço convertido para número', async () => {
  produtoRepository.listarTodos.mockResolvedValue([
    { id: 1, nome: 'Teclado', preco: '150.00' },
    { id: 2, nome: 'Mouse', preco: '80.00' },
  ]);

  await expect(catalogoService.listar()).resolves.toEqual([
    { id: 1, nome: 'Teclado', preco: 150 },
    { id: 2, nome: 'Mouse', preco: 80 },
  ]);
});

test('retorna lista vazia quando não há produtos', async () => {
  produtoRepository.listarTodos.mockResolvedValue([]);

  await expect(catalogoService.listar()).resolves.toEqual([]);
});
