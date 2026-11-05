const healthService = require('../services/health.service');

async function healthController(req, res) {
  const bancoOk = await healthService.bancoDisponivel();

  if (!bancoOk) {
    return res.status(503).json({ api: 'ok', banco: 'indisponível' });
  }

  return res.status(200).json({ api: 'ok', banco: 'conectado' });
}

module.exports = { healthController };
