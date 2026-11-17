const { registry } = require('../metrics');

async function metricsController(req, res) {
  res.set('Content-Type', registry.contentType);
  return res.status(200).send(await registry.metrics());
}

module.exports = { metricsController };
