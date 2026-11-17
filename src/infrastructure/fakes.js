// Nenhum pagamento ou estoque real é acessado.
export function authorizePayment({sku}) {
  return sku === 'SKU-PAGAMENTO-NEGADO' ? 'DENIED' : 'AUTHORIZED';
}
export function reserveStock({sku}) {
  if (sku === 'SKU-SEM-ESTOQUE') return 'FAILED';
  if (sku === 'SKU-PENDENTE') return 'PENDING';
  return 'RESERVED';
}
