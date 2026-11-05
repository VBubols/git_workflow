jest.mock('../../src/config/database', () => ({
  authenticate: jest.fn(),
}));

const sequelize = require('../../src/config/database');
const healthService = require('../../src/services/health.service');

test('retorna true quando o banco responde', async () => {
  sequelize.authenticate.mockResolvedValue();

  await expect(healthService.bancoDisponivel()).resolves.toBe(true);
});

test('retorna false quando a conexão com o banco falha', async () => {
  sequelize.authenticate.mockRejectedValue(new Error('connect ECONNREFUSED'));

  await expect(healthService.bancoDisponivel()).resolves.toBe(false);
});
