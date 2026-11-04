const sequelize = require("../config/database");
const DataTypes = require("sequelize");

export const Produto = sequelize.define(
    'Produto',
    {
        id:    { type: DataTypes.UUID, primaryKey: true },
        nome:  { type: DataTypes.STRING(100), allowNull: false },
        preco: { type: DataTypes.NUMBER, allowNull: false }
    }
)