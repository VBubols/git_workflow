const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ItemCarrinho = sequelize.define(
  'ItemCarrinho',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    produtoId: { type: DataTypes.INTEGER, allowNull: false, unique: true, field: 'produto_id' },
    quantidade: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1, validate: { min: 1 } },
  },
  {
    tableName: 'itens_carrinho',
    timestamps: false,
  },
);

module.exports = ItemCarrinho;