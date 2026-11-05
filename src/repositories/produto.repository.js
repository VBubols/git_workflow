const { Produto } = require('../models');

async function listarTodos() {
  return Produto.findAll({ order: [['id', 'ASC']], raw: true });
}

async function buscarPorId(id) {
  return Produto.findByPk(id, { raw: true });
}

module.exports = { listarTodos, buscarPorId };
