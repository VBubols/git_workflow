const {
  limparCarrinho,
  adicionarItem,
  deletarItem,
  obterCarrinho,
  calcularTotal
} = require("../src/carrinho");

function listarCarrinhoController(req, res) {
    try {
        return res.status(200).json({ itens: obterCarrinho(), total: calcularTotal() });
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
};

function limparCarrinhoController(req, res) {
    try {
        limparCarrinho();
        return res.status(200).json({ mensagem: 'Carrinho limpo!' });
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
};

function adicionarItemController(req, res) {
    try {
        const indice = req.body?.indice;
        if(!Number.isInteger(indice)) {
            return res.status(400).json({ mensagem: 'Requisição mal formada.' })
        }

        const produtoAdc = adicionarItem(indice);

        if (!produtoAdc) {
            return res.status(404).json({ mensagem: 'Produto não encontrado' })
        }

        return res.status(201).json({ mensagem: 'Produto adicionado!'});
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
};

function deletarItemController(req, res) {
    try {
        const nome = req.params.nome;
        if(!nome) {
            return res.status(400).json({ mensagem: 'Requisição mal formada.' })
        }

        const produtoDel = deletarItem(nome);

        if (!produtoDel) {
            return res.status(404).json({ mensagem: 'Item não encontrado no carrinho' })
        }

        return res.status(200).json({ mensagem: 'Produto removido!'});
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
};

module.exports = {
    listarCarrinhoController,
    limparCarrinhoController,
    adicionarItemController,
    deletarItemController
};