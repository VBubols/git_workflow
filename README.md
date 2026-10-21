# Git_workflow

![Tests](https://github.com/VBubols/git_workflow/actions/workflows/test.yml/badge.svg)
![Build](https://github.com/VBubols/git_workflow/actions/workflows/build.yml/badge.svg)

API REST de carrinho de compras feita com Node.js e Express, empacotada em Docker e validada por pipelines de CI no GitHub Actions.

O projeto começou como um carrinho de linha de comando e evoluiu para uma API. A lógica de negócio continua isolada em `src/` e coberta por testes, e a camada HTTP fica por cima dela.

## Stack

- **Node.js 22** e **Express 5**
- **Jest** para testes unitários
- **Docker** para empacotar e rodar a API
- **GitHub Actions** para testes e validação da imagem

## Estrutura

```
.
├── .github/workflows/
│   ├── build.yml               # build da imagem e teste da API no container
│   └── test.yml                # testes unitários com cobertura
├── controllers/
│   ├── carrinho.controller.js  # valida a entrada e define o status HTTP
│   └── catalogo.controller.js
├── routes/
│   ├── carrinho.routes.js      # liga método + caminho ao controller
│   └── catalogo.routes.js
├── src/
│   ├── carrinho.js             # regras do carrinho
│   └── catalogo.js             # produtos disponíveis
├── tests/
│   └── carrinho.test.js
├── Dockerfile
└── index.js                    # servidor Express
```

O fluxo de uma requisição é **rota → controller → regra de negócio**. As funções de `src/` retornam `true` ou `false`, e o controller traduz esse resultado no status HTTP adequado.

## Como rodar

### Localmente

Pré-requisito: Node.js 22.

```bash
npm install
npm start
```

A API sobe em `http://localhost:3000`.

### Com Docker (build local)

```bash
docker build -t git-workflow .
docker run -d -p 3000:3000 --name git-workflow git-workflow
```

Para ver os logs: `docker logs git-workflow`. Para parar e remover: `docker rm -f git-workflow`.

### Com a imagem do Docker Hub

A imagem está publicada em [vbubols/git-workflow](https://hub.docker.com/r/vbubols/git-workflow):

```bash
docker run -d -p 3000:3000 --name git-workflow vbubols/git-workflow:1.0.0
```

> Informe a tag `1.0.0` explicitamente. A imagem não tem tag `latest`, então `docker pull vbubols/git-workflow` sem tag falha.

## Endpoints

| Método | Rota | Descrição | Sucesso |
|---|---|---|---|
| `GET` | `/catalogo` | Lista os produtos com seus índices | `200` |
| `GET` | `/carrinho` | Lista os itens do carrinho e o total | `200` |
| `POST` | `/carrinho` | Adiciona uma unidade de um produto pelo índice | `201` |
| `DELETE` | `/carrinho/:nome` | Remove uma unidade de um item pelo nome | `200` |
| `DELETE` | `/carrinho` | Esvazia o carrinho | `200` |

### Erros

| Status | Quando acontece |
|---|---|
| `400` | `POST` sem um `indice` inteiro no corpo da requisição |
| `404` | `POST` com índice fora do catálogo, ou `DELETE` de um item que não está no carrinho |
| `500` | Erro inesperado no servidor |

Todas as respostas de erro seguem o formato `{ "mensagem": "..." }`.

### Exemplos

**Consultar o catálogo**

```bash
curl localhost:3000/catalogo
```

```json
[
  { "indice": 0, "nome": "Teclado", "preco": 150 },
  { "indice": 1, "nome": "Mouse", "preco": 80 },
  { "indice": 2, "nome": "Monitor", "preco": 900 },
  { "indice": 3, "nome": "Gabinete", "preco": 120 },
  { "indice": 4, "nome": "Headset", "preco": 320 },
  { "indice": 5, "nome": "Cadeira Gamer", "preco": 540 }
]
```

**Adicionar um produto**

O corpo precisa ser JSON, com o header `Content-Type: application/json`. Adicionar um produto que já está no carrinho aumenta a quantidade.

```bash
curl -X POST -H "Content-Type: application/json" -d '{"indice": 1}' localhost:3000/carrinho
```

```json
{ "mensagem": "Produto adicionado!" }
```

**Ver o carrinho**

```bash
curl localhost:3000/carrinho
```

```json
{
  "itens": [
    { "nome": "Mouse", "preco": 80, "quantidade": 2 },
    { "nome": "Teclado", "preco": 150, "quantidade": 1 }
  ],
  "total": 310
}
```

**Remover um item**

Remove uma unidade por vez. Quando a quantidade chega a zero, o item sai do carrinho. A busca pelo nome não diferencia maiúsculas de minúsculas.

```bash
curl -X DELETE localhost:3000/carrinho/mouse
```

```json
{ "mensagem": "Produto removido!" }
```

Para nomes com espaço, codifique na URL: `/carrinho/cadeira%20gamer`.

**Esvaziar o carrinho**

```bash
curl -X DELETE localhost:3000/carrinho
```

```json
{ "mensagem": "Carrinho limpo!" }
```

## Testes

```bash
npm test               # roda os testes
npm run test:coverage  # roda os testes e gera o relatório de cobertura
```

Os testes cobrem as regras de negócio em `src/`: adição, remoção, cálculo do total, formatação e casos de borda, como índices inválidos e itens inexistentes.

## CI/CD

Os dois workflows rodam em todo pull request e em todo push para `main` e `dev`.

- **Tests** (`test.yml`): instala as dependências com Node 22, roda o Jest com cobertura e confere se o relatório foi gerado.
- **Build** (`build.yml`): constrói a imagem Docker, sobe o container e valida a API com `curl`, percorrendo o fluxo consultar catálogo → adicionar item → ver carrinho. Se algum passo falhar, o workflow exibe os logs do container. No final, o container é sempre parado.

Como o `curl` usa `-f`, qualquer resposta `4xx` ou `5xx` derruba o job. O primeiro `curl` tenta de novo por alguns segundos, dando tempo para o servidor subir antes da validação.

## Fluxo de trabalho Git

- **`main`**: versão estável.
- **`dev`**: branch de integração.
- **`feat/*` e `fix/*`**: criadas a partir da `dev` para cada mudança.

Toda mudança entra por pull request: `feat/*` ou `fix/*` para `dev`, e depois `dev` para `main`. Como os workflows rodam no PR, cada mudança é testada antes do merge.

## Observações

- **O carrinho vive em memória.** Reiniciar o servidor ou o container zera o carrinho.
- **Existe um único carrinho**, compartilhado por todos que acessam a API.
- **A porta é fixa em 3000.**