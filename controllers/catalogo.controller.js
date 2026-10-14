const catalogo = require("../src/catalogo");

function catalogoController(req, res) {
    try {
        return res.status(200).json(catalogo.map((produto, indice) => ({ indice, ...produto })));
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
};

module.exports = { catalogoController };