const client = require("prom-client");

const registry = new client.Registry();

// Métricas padrão do Node.js: CPU, memória, event loop lag, handles etc.
client.collectDefaultMetrics({ register: registry });

// Counter: total de requisições HTTP, nunca diminui.
const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total de requisições HTTP recebidas",
  labelNames: ["method", "route", "status_code"],
  registers: [registry]
});

// Histogram: distribuição da duração das requisições (em segundos).
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duração das requisições HTTP em segundos",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.05, 0.1, 0.25, 0.5, 1, 2.5],
  registers: [registry]
});

function metricsMiddleware(req, res, next) {
  const endTimer = httpRequestDuration.startTimer();

  res.on("finish", () => {
    // Usa o padrão da rota (ex.: /tasks/:id) e não a URL real,
    // para não criar uma série nova para cada ID.
    const route = req.route?.path
      ? `${req.baseUrl || ""}${req.route.path}`
      : "unmatched";

    const labels = {
      method: req.method,
      route,
      status_code: res.statusCode
    };

    httpRequestsTotal.inc(labels);
    endTimer(labels);
  });

  next();
}

async function getMetrics() {
  return registry.metrics();
}

function getContentType() {
  return registry.contentType;
}

module.exports = {
  registry,
  metricsMiddleware,
  getMetrics,
  getContentType
};
