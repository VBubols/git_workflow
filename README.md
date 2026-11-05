# git_workflow

![CI/CD](https://github.com/VBubols/git_workflow/actions/workflows/pipeline.yml/badge.svg)

API REST de carrinho de compras feita com Node.js, Express e Sequelize, com os dados em PostgreSQL. A API e o banco rodam em containers separados, orquestrados com Docker Compose, e cada mudança é validada por pipelines no GitHub Actions.

## Arquitetura

```
            Docker Compose (rede interna)
 ┌───────────────────────────────────────────────┐
 │                                               │
 │   ┌─────────────┐   db:5432   ┌────────────┐  │
 │   │     api     │ ──────────► │     db     │  │
 │   │  Node 22    │             │ Postgres 16│  │
 │   └─────────────┘             └────────────┘  │
 │         ▲                           │         │
 └─────────┼───────────────────────────┼─────────┘
           │ localhost:3000            │ volume pgdata
        cliente                    dados persistidos
```

- A API acessa o banco pelo **nome do serviço** (`db`), resolvido pela rede interna do Compose. O banco não expõe porta para fora.
- A API só sobe depois que o banco passa no **healthcheck** (`pg_isready`).
- Os dados ficam no **volume `pgdata`** e sobrevivem a restarts e a `docker compose down`.

### Camadas da aplicação

```
routes → controllers → services → repositories → models (Sequelize) → PostgreSQL
```

| Camada         | Responsabilidade                                                                         |
| -------------- | ---------------------------------------------------------------------------------------- |
| `routes`       | Liga método e caminho HTTP ao controller                                                 |
| `controllers`  | Lê a requisição, valida a entrada e define o status da resposta                          |
| `services`     | Regras de negócio: incrementar quantidade, remover uma unidade por vez, calcular o total |
| `repositories` | Acesso ao banco pelo Sequelize, sem regra de negócio                                     |
| `models`       | Estrutura das tabelas `produtos` e `itens_carrinho`                                      |
| `middlewares`  | Tratamento centralizado de erros e de rotas inexistentes                                 |

Os services dependem só dos repositories. Por isso as regras são testadas sem banco, trocando os repositories por versões falsas.

## Stack

- **Node.js 22**, **Express 5**
- **PostgreSQL 16** com **Sequelize 6**
- **Docker** e **Docker Compose**
- **Jest** e **Supertest** para testes
- **ESLint** e **Prettier** para padronização
- **GitHub Actions** para CI

## Estrutura

```
.
├── .github/workflows/
│   ├── build.yml             # sobe o Compose e testa a API integrada ao banco
│   └── test.yml              # lint, formatação e testes com cobertura
├── src/
│   ├── config/database.js    # conexão do Sequelize, lida das variáveis de ambiente
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   ├── seeds/                # catálogo inicial de produtos
│   ├── services/
│   ├── app.js                # cria o app Express e registra rotas e middlewares
│   └── index.js              # conecta ao banco, cria as tabelas, popula e sobe o servidor
├── tests/
│   ├── routes/               # testes dos endpoints com Supertest
│   └── services/             # testes das regras de negócio
├── .env.example
├── docker-compose.yml
└── Dockerfile
```

## Como rodar

Pré-requisito: Docker com o Docker Compose.

```bash
cp .env.example .env
docker compose up --build
```

Ao iniciar, a API conecta ao banco, cria as tabelas e popula o catálogo se ele estiver vazio. Para conferir a comunicação entre os containers:

```bash
curl localhost:3000/health
```

```json
{ "api": "ok", "banco": "conectado" }
```

Para parar:

```bash
docker compose down      # para os containers e mantém os dados
docker compose down -v   # para os containers e apaga o volume do banco
```

### Variáveis de ambiente

| Variável      | Uso                                     | Padrão      |
| ------------- | --------------------------------------- | ----------- |
| `DB_NAME`     | Nome do banco                           | sem padrão  |
| `DB_USER`     | Usuário do banco                        | sem padrão  |
| `DB_PASSWORD` | Senha do banco                          | sem padrão  |
| `DB_HOST`     | Host do banco (no Compose, sempre `db`) | `localhost` |
| `DB_PORT`     | Porta do banco                          | `5432`      |
| `PORT`        | Porta da API                            | `3000`      |

O `.env` não vai para o repositório. O `.env.example` mostra o que preencher.

## Endpoints

| Método   | Rota                   | Descrição                              | Sucesso |
| -------- | ---------------------- | -------------------------------------- | ------- |
| `GET`    | `/health`              | Status da API e da conexão com o banco | `200`   |
| `GET`    | `/catalogo`            | Lista os produtos                      | `200`   |
| `GET`    | `/carrinho`            | Lista os itens do carrinho e o total   | `200`   |
| `POST`   | `/carrinho`            | Adiciona uma unidade de um produto     | `201`   |
| `DELETE` | `/carrinho/:produtoId` | Remove uma unidade de um item          | `200`   |
| `DELETE` | `/carrinho`            | Esvazia o carrinho                     | `200`   |

### Erros

| Status | Quando acontece                                                                       |
| ------ | ------------------------------------------------------------------------------------- |
| `400`  | `produtoId` ausente, não inteiro ou não positivo, ou JSON inválido no corpo           |
| `404`  | Produto inexistente no `POST`, item fora do carrinho no `DELETE`, ou rota inexistente |
| `500`  | Erro inesperado no servidor                                                           |
| `503`  | `/health` quando o banco está indisponível                                            |

As respostas de erro seguem o formato `{ "mensagem": "..." }`.

### Exemplos

**Consultar o catálogo**

```bash
curl localhost:3000/catalogo
```

```json
[
  { "id": 1, "nome": "Teclado", "preco": 150 },
  { "id": 2, "nome": "Mouse", "preco": 80 },
  { "id": 3, "nome": "Monitor", "preco": 900 },
  { "id": 4, "nome": "Gabinete", "preco": 120 },
  { "id": 5, "nome": "Headset", "preco": 320 },
  { "id": 6, "nome": "Cadeira Gamer", "preco": 540 }
]
```

**Adicionar um produto**

Adicionar um produto que já está no carrinho aumenta a quantidade.

```bash
curl -X POST -H "Content-Type: application/json" -d '{"produtoId": 2}' localhost:3000/carrinho
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
    { "produtoId": 2, "nome": "Mouse", "preco": 80, "quantidade": 2 },
    { "produtoId": 1, "nome": "Teclado", "preco": 150, "quantidade": 1 }
  ],
  "total": 310
}
```

**Remover um item**

Remove uma unidade por vez. Quando a quantidade chega a zero, o item sai do carrinho.

```bash
curl -X DELETE localhost:3000/carrinho/2
```

```json
{ "mensagem": "Produto removido!" }
```

**Esvaziar o carrinho**

```bash
curl -X DELETE localhost:3000/carrinho
```

```json
{ "mensagem": "Carrinho limpo!" }
```

## Testes e qualidade

```bash
npm test               # roda os testes
npm run test:coverage  # testes com relatório de cobertura
npm run lint           # ESLint
npm run format:check   # confere a formatação do Prettier
npm run format         # aplica a formatação
```

Os testes são divididos em dois níveis, nenhum deles depende do banco:

- **Services:** regras de negócio com os repositories mockados (produto inexistente, incremento, decremento, remoção, cálculo do total, conversão do preço).
- **Endpoints:** requisições HTTP com Supertest e os services mockados (status codes, validação do `produtoId`, JSON inválido, erros internos, rotas inexistentes).

A integração real entre a API e o banco é testada no pipeline `Build`.

## CI/CD

O pipeline (`pipeline.yml`) roda em todo pull request e em todo push para `main` e `dev`, com três jobs em sequência:

1. **test**: instala as dependências, roda o ESLint, confere a formatação e executa os testes com cobertura.
2. **docker**: sobe a API e o banco com Docker Compose, valida o fluxo completo com `curl` e confere a persistência depois de reiniciar a API.
3. **publish**: só no push para a `main`. Calcula a próxima versão a partir da última tag `vX.Y.Z` do repositório, incrementando apenas o PATCH. Publica a imagem no Docker Hub com a versão e com `latest`, confere a publicação baixando a imagem e cria a tag correspondente no GitHub.

Imagens publicadas: [vbubols/git-workflow](https://hub.docker.com/r/vbubols/git-workflow/tags)

## Fluxo de trabalho Git

- **`main`**: versão estável.
- **`dev`**: branch de integração.
- **`feat/*` e `fix/*`**: criadas a partir da `dev` para cada mudança.

Toda mudança entra por pull request: `feat/*` ou `fix/*` para `dev`, e depois `dev` para `main`. Como os workflows rodam no PR, cada mudança é testada antes do merge.

## Observações

- O catálogo é inserido apenas quando a tabela de produtos está vazia, então reiniciar a aplicação não duplica os produtos.
- Existe um único carrinho, compartilhado por todos que acessam a API.
