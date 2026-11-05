const express = require('express');
const { catalogoController } = require('../controllers/catalogo.controller');

const routerCatalogo = express.Router();

routerCatalogo.get('/catalogo', catalogoController);

module.exports = routerCatalogo;
