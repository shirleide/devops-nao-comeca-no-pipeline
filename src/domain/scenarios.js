// Fixtures didáticas, sem dados de produtos ou clientes reais.
export const scenarios = Object.freeze([
  {sku: 'SKU-DISPONIVEL', name: '01 - Pedido válido', expectedStatus: 'CONFIRMED',
    faultAt: null, lesson: 'Pagamento autorizado e estoque reservado permitem confirmar.'},
  {sku: 'SKU-PAGAMENTO-NEGADO', name: '02 - Pagamento recusado', expectedStatus: 'REJECTED',
    faultAt: 'PAYMENT', lesson: 'Não tentar reservar nem confirmar sem autorização.'},
  {sku: 'SKU-PAGAMENTO-PENDENTE', name: '03 - Pagamento inconclusivo', expectedStatus: 'PENDING',
    faultAt: 'PAYMENT', lesson: 'Manter pendente enquanto não houver resposta definitiva.'},
  {sku: 'SKU-SEM-ESTOQUE', name: '04 - Reserva recusada', expectedStatus: 'REQUIRES_COMPENSATION',
    faultAt: 'STOCK', lesson: 'Não confirmar; compensação financeira a avaliar, não executada.'},
  {sku: 'SKU-PENDENTE', name: '05 - Reserva inconclusiva', expectedStatus: 'PENDING',
    faultAt: 'STOCK', lesson: 'Manter pendente e reconciliar; não compensar precipitadamente.'}
]);
