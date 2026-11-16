jest.mock('../../src/services/carrinho.service', () => ({
  listar: jest.fn(),
  adicionar: jest.fn(),
  remover: jest.fn(),
  limpar: jest.fn(),
}));

const request = require('supertest');
const app = require('../../src/app');
const carrinhoService = require('../../src/services/carrinho.service');

async function lerMetricas() {
  const resposta = await request(app).get('/metrics');
  return resposta.text;
}

describe('GET /metrics', () => {
  test('responde 200 no formato texto do Prometheus', async () => {
    const resposta = await request(app).get('/metrics');

    expect(resposta.status).toBe(200);
    expect(resposta.headers['content-type']).toMatch(/^text\/plain/);
    expect(resposta.text).toContain('# TYPE http_requests_total counter');
    expect(resposta.text).toContain('# TYPE http_request_duration_seconds histogram');
    expect(resposta.text).toContain('# TYPE carrinho_itens_adicionados_total counter');
    expect(resposta.text).toContain('process_cpu_seconds_total');
  });

  test('registra o padrão da rota, e não o id da URL', async () => {
    carrinhoService.remover.mockResolvedValue(true);

    await request(app).delete('/carrinho/2');
    const metricas = await lerMetricas();

    expect(metricas).toMatch(
      /http_requests_total\{method="DELETE",route="\/carrinho\/:produtoId",status_code="200"\} 1/,
    );
    expect(metricas).not.toContain('route="/carrinho/2"');
  });

  test('agrupa rotas inexistentes como "unmatched"', async () => {
    await request(app).get('/nao-existe');
    const metricas = await lerMetricas();

    expect(metricas).toMatch(
      /http_requests_total\{method="GET",route="unmatched",status_code="404"\} 1/,
    );
  });

  test('não conta as próprias coletas do Prometheus', async () => {
    await lerMetricas();
    const metricas = await lerMetricas();

    expect(metricas).not.toContain('route="/metrics"');
  });
});
