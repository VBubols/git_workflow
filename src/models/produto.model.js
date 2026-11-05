const sequelize = require("../config/database");
const {DataTypes} = require("sequelize");

const Produto = sequelize.define(
    'Produto',
    {
        id:    { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        nome:  { type: DataTypes.STRING(100), allowNull: false },
        preco: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
    },
    {
        tableName: 'produto',
        timestamps: false
    }
);

module.exports = Produto;