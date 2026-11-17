#!/usr/bin/env bash
# Gera tráfego na API para os painéis do Grafana terem o que mostrar.
# Mistura requisições normais com erros propositais (400 e 404).
#
# Uso: ./scripts/carga.sh [segundos]       (padrão: 120)
#      BASE_URL=http://outro-host:3000 ./scripts/carga.sh

BASE_URL="${BASE_URL:-http://localhost:3000}"
DURACAO="${1:-120}"
FIM=$((SECONDS + DURACAO))
TOTAL=0

requisicao() {
  curl -s -o /dev/null -w '%{http_code}' "$@"
}

post_carrinho() {
  requisicao -X POST -H 'Content-Type: application/json' -d "$1" "$BASE_URL/carrinho"
}

echo "Gerando carga em $BASE_URL por $DURACAO segundos (Ctrl+C para parar)..."

while [ "$SECONDS" -lt "$FIM" ]; do
  PRODUTO=$((RANDOM % 6 + 1))
  SORTEIO=$((RANDOM % 100))

  if [ "$SORTEIO" -lt 25 ]; then
    STATUS=$(requisicao "$BASE_URL/catalogo")
  elif [ "$SORTEIO" -lt 50 ]; then
    STATUS=$(post_carrinho "{\"produtoId\":$PRODUTO}")
  elif [ "$SORTEIO" -lt 70 ]; then
    STATUS=$(requisicao "$BASE_URL/carrinho")
  elif [ "$SORTEIO" -lt 82 ]; then
    STATUS=$(requisicao -X DELETE "$BASE_URL/carrinho/$PRODUTO")
  elif [ "$SORTEIO" -lt 88 ]; then
    STATUS=$(post_carrinho '{"produtoId":"abc"}') # 400: id inválido
  elif [ "$SORTEIO" -lt 94 ]; then
    STATUS=$(post_carrinho '{"produtoId":99}') # 404: produto inexistente
  else
    STATUS=$(requisicao "$BASE_URL/rota-inexistente") # 404: rota inexistente
  fi

  TOTAL=$((TOTAL + 1))
  printf '\r%d requisições enviadas (última: HTTP %s)   ' "$TOTAL" "$STATUS"
  sleep 0.1
done

echo
echo "Carga finalizada: $TOTAL requisições."
