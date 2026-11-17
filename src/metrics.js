const client = require('prom-client');

const registry = new client.Registry();

// Métricas padrão do Node.js: CPU, memória, heap, event loop lag etc.
client.collectDefaultMetrics({ register: registry });

// Counter: total de requisições HTTP. Só aumenta.
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total de requisições HTTP recebidas',
  labelNames: ['method', 'route', 'status_code'],
  registers: [registry],
});

// Histogram: distribuição do tempo de resposta, em segundos.
// Os buckets pequenos importam: esta API responde em poucos milissegundos.
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duração das requisições HTTP em segundos',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5],
  registers: [registry],
});

// Métrica de negócio: unidades adicionadas ao carrinho, por produto.
const itensAdicionadosTotal = new client.Counter({
  name: 'carrinho_itens_adicionados_total',
  help: 'Total de unidades adicionadas ao carrinho, por produto',
  labelNames: ['produto'],
  registers: [registry],
});

function metricsMiddleware(req, res, next) {
  // A coleta do Prometheus a cada 15s não é tráfego de usuário.
  if (req.path === '/metrics') {
    return next();
  }

  const endTimer = httpRequestDuration.startTimer();

  res.on('finish', () => {
    // Usa o padrão da rota (/carrinho/:produtoId), e não a URL real (/carrinho/2),
    // para não criar uma série nova para cada id.
    const route = req.route?.path ? `${req.baseUrl}${req.route.path}` : 'unmatched';

    const labels = {
      method: req.method,
      route,
      status_code: res.statusCode,
    };

    httpRequestsTotal.inc(labels);
    endTimer(labels);
  });

  return next();
}

module.exports = {
  registry,
  metricsMiddleware,
  itensAdicionadosTotal,
};
