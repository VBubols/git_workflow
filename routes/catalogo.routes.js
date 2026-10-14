const express = require("express");
const routerCatalogo = express.Router();

const { catalogoController } = require("../controllers/catalogo.controller.js");

routerCatalogo.get('/catalogo', catalogoController);

module.exports = routerCatalogo;