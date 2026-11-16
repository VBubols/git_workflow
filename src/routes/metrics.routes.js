const express = require('express');
const { metricsController } = require('../controllers/metrics.controller');

const routerMetrics = express.Router();

routerMetrics.get('/metrics', metricsController);

module.exports = routerMetrics;
