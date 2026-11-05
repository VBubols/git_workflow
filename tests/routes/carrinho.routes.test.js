jest.mock('../../src/services/carrinho.service', () => ({
    listar: jest.fn(),
    adicionar: jest.fn(),
    remover: jest.fn(),
    limpar: jest.fn(),
  }));
  
  const request = require('supertest');
  const app = require('../../src/app');
  const carrinhoService = require('../../src/services/carrinho.service');
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('GET /carrinho', () => {
    test('responde 200 com os itens e o total', async () => {
      const carrinho = {
        itens: [{ produtoId: 2, nome: 'Mouse', preco: 80, quantidade: 2 }],
        total: 160,
      };
      carrinhoService.listar.mockResolvedValue(carrinho);
  
      const resposta = await request(app).get('/carrinho');
  
      expect(resposta.status).toBe(200);
      expect(resposta.body).toEqual(carrinho);
    });
  
    test('responde 500 quando o service lança erro', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      carrinhoService.listar.mockRejectedValue(new Error('banco fora do ar'));
  
      const resposta = await request(app).get('/carrinho');
  
      expect(resposta.status).toBe(500);
      expect(resposta.body).toEqual({ mensagem: 'Erro interno no servidor.' });
      console.error.mockRestore();
    });
  });
  
  describe('POST /carrinho', () => {
    test('responde 201 quando o produto é adicionado', async () => {
      carrinhoService.adicionar.mockResolvedValue(true);
  
      const resposta = await request(app).post('/carrinho').send({ produtoId: 2 });
  
      expect(resposta.status).toBe(201);
      expect(carrinhoService.adicionar).toHaveBeenCalledWith(2);
    });
  
    test('responde 404 quando o produto não existe', async () => {
      carrinhoService.adicionar.mockResolvedValue(false);
  
      const resposta = await request(app).post('/carrinho').send({ produtoId: 99 });
  
      expect(resposta.status).toBe(404);
      expect(resposta.body).toEqual({ mensagem: 'Produto não encontrado.' });
    });
  
    test.each([
      ['sem corpo', undefined],
      ['sem produtoId', {}],
      ['produtoId como texto', { produtoId: '2' }],
      ['produtoId decimal', { produtoId: 2.5 }],
      ['produtoId zero', { produtoId: 0 }],
      ['produtoId negativo', { produtoId: -1 }],
      ['produtoId acima do limite do INTEGER', { produtoId: 2147483648 }],
    ])('responde 400 %s', async (_descricao, corpo) => {
      const resposta = await request(app).post('/carrinho').send(corpo);
  
      expect(resposta.status).toBe(400);
      expect(carrinhoService.adicionar).not.toHaveBeenCalled();
    });
  
    test('responde 400 quando o JSON é inválido', async () => {
      const resposta = await request(app)
        .post('/carrinho')
        .set('Content-Type', 'application/json')
        .send('{ produtoId: ');
  
      expect(resposta.status).toBe(400);
      expect(resposta.body).toEqual({ mensagem: 'JSON inválido no corpo da requisição.' });
    });
  });
  
  describe('DELETE /carrinho/:produtoId', () => {
    test('responde 200 quando o item é removido', async () => {
      carrinhoService.remover.mockResolvedValue(true);
  
      const resposta = await request(app).delete('/carrinho/2');
  
      expect(resposta.status).toBe(200);
      expect(carrinhoService.remover).toHaveBeenCalledWith(2);
    });
  
    test('responde 404 quando o item não está no carrinho', async () => {
      carrinhoService.remover.mockResolvedValue(false);
  
      const resposta = await request(app).delete('/carrinho/3');
  
      expect(resposta.status).toBe(404);
      expect(resposta.body).toEqual({ mensagem: 'Item não encontrado no carrinho.' });
    });
  
    test.each(['abc', '2.5', '-1', '0', '2147483648'])('responde 400 para o id "%s"', async (id) => {
      const resposta = await request(app).delete(`/carrinho/${id}`);
  
      expect(resposta.status).toBe(400);
      expect(carrinhoService.remover).not.toHaveBeenCalled();
    });
  });
  
  describe('DELETE /carrinho', () => {
    test('responde 200 e esvazia o carrinho', async () => {
      carrinhoService.limpar.mockResolvedValue();
  
      const resposta = await request(app).delete('/carrinho');
  
      expect(resposta.status).toBe(200);
      expect(carrinhoService.limpar).toHaveBeenCalledTimes(1);
    });
  });