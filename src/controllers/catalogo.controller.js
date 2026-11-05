const catalogoService = require('../services/catalogo.service');

async function catalogoController(req, res) {
  const produtos = await catalogoService.listar();
  return res.status(200).json(produtos);
}

module.exports = { catalogoController };