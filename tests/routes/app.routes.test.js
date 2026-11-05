jest.mock('../../src/services/catalogo.service', () => ({
    listar: jest.fn(),
  }));
  
  jest.mock('../../src/services/health.service', () => ({
    bancoDisponivel: jest.fn(),
  }));
  
  const request = require('supertest');
  const app = require('../../src/app');
  const catalogoService = require('../../src/services/catalogo.service');
  const healthService = require('../../src/services/health.service');
  
  describe('GET /catalogo', () => {
    test('responde 200 com a lista de produtos', async () => {
      const produtos = [{ id: 1, nome: 'Teclado', preco: 150 }];
      catalogoService.listar.mockResolvedValue(produtos);
  
      const resposta = await request(app).get('/catalogo');
  
      expect(resposta.status).toBe(200);
      expect(resposta.body).toEqual(produtos);
    });
  });
  
  describe('GET /health', () => {
    test('responde 200 quando o banco está conectado', async () => {
      healthService.bancoDisponivel.mockResolvedValue(true);
  
      const resposta = await request(app).get('/health');
  
      expect(resposta.status).toBe(200);
      expect(resposta.body).toEqual({ api: 'ok', banco: 'conectado' });
    });
  
    test('responde 503 quando o banco está indisponível', async () => {
      healthService.bancoDisponivel.mockResolvedValue(false);
  
      const resposta = await request(app).get('/health');
  
      expect(resposta.status).toBe(503);
      expect(resposta.body).toEqual({ api: 'ok', banco: 'indisponível' });
    });
  });
  
  describe('rotas inexistentes', () => {
    test('respondem 404 em JSON', async () => {
      const resposta = await request(app).get('/nao-existe');
  
      expect(resposta.status).toBe(404);
      expect(resposta.body).toEqual({ mensagem: 'Rota não encontrada.' });
    });
  });