const app = require('./app');
const sequelize = require('./config/database');
const { popularProdutos } = require('./seeds/produtos.seed');

const PORT = Number(process.env.PORT) || 3000;

async function iniciar() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    await popularProdutos();

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}, conectado ao banco ${process.env.DB_NAME}`);
    });
  } catch (error) {
    console.error('Falha ao iniciar a aplicação:', error.message);
    process.exit(1);
  }
}

iniciar();