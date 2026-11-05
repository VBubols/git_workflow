const Produto = require('./produto.model');
const ItemCarrinho = require('./itemCarrinho.model');

Produto.hasOne(ItemCarrinho, { foreignKey: 'produtoId', onDelete: 'CASCADE' });
ItemCarrinho.belongsTo(Produto, { foreignKey: 'produtoId', as: 'produto' });

module.exports = { Produto, ItemCarrinho };