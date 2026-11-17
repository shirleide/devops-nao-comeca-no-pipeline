# Fluxo ideal e pontos de falha

| Cenário | Pagamento | Estoque | Estado do pedido | Ação pedagógica |
|---|---|---|---|---|
| SKU-DISPONIVEL | AUTHORIZED | RESERVED | CONFIRMED | Pedido válido |
| SKU-PAGAMENTO-NEGADO | DENIED | NOT_ATTEMPTED | REJECTED | Bloqueia estoque e confirmação |
| SKU-PAGAMENTO-PENDENTE | PENDING | NOT_ATTEMPTED | PENDING | Reconcilia sem confirmar |
| SKU-SEM-ESTOQUE | AUTHORIZED | FAILED | REQUIRES_COMPENSATION | Bloqueia confirmação e registra necessidade de compensação |
| SKU-PENDENTE | AUTHORIZED | PENDING | PENDING | Aguarda reserva definitiva |
| Requisição inválida | Não chamado | Não chamado | Não criado | HTTP 400 |

**Atenção:** o case não cancela ou reverte pagamentos. O status REQUIRES_COMPENSATION indica necessidade de tratamento, não uma ação de estorno efetivamente executada.

## Timeline exposta por GET /orders/{id}/flow

REQUEST → PAYMENT → STOCK → DOMAIN_RULE → ORDER_STATE.

## Bug da fase 01

Pagamento autorizado sozinho gerava CONFIRMED; na fase 03, os testes detectam a violação. Na fase 04, a confirmação exige as duas condições. Na main, caminhos de falha são estados explícitos.
