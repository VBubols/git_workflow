function rotaNaoEncontrada(req, res) {
  return res.status(404).json({ mensagem: 'Rota não encontrada.' });
}

// O Express 5 encaminha para cá qualquer erro lançado dentro de um controller async,
// então os controllers não precisam repetir try/catch.
// O quarto parâmetro precisa existir: é por ele que o Express reconhece o middleware de erro.
function tratarErros(err, req, res, _next) {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ mensagem: 'JSON inválido no corpo da requisição.' });
  }

  console.error(err);
  return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
}

module.exports = { rotaNaoEncontrada, tratarErros };
