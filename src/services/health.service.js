const sequelize = require('../config/database');

// Confirma que a API consegue falar com o container do banco.
async function bancoDisponivel() {
  try {
    await sequelize.authenticate();
    return true;
  } catch {
    return false;
  }
}

module.exports = { bancoDisponivel };
