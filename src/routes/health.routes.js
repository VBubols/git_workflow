const express = require('express');
const { healthController } = require('../controllers/health.controller');

const routerHealth = express.Router();

routerHealth.get('/health', healthController);

module.exports = routerHealth;
