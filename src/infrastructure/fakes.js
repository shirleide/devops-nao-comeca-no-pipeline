// Integrações simuladas e determinísticas; sem pagamento ou estoque reais.
export function authorizePayment({sku}) {
  if (sku === 'SKU-PAGAMENTO-NEGADO') return 'DENIED';
  if (sku === 'SKU-PAGAMENTO-PENDENTE') return 'PENDING';
  return 'AUTHORIZED';
}
export function reserveStock({sku}) {
  if (sku === 'SKU-SEM-ESTOQUE') return 'FAILED';
  if (sku === 'SKU-PENDENTE') return 'PENDING';
  return 'RESERVED';
}
