export const OrderStatus = Object.freeze({
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  REQUIRES_COMPENSATION: 'REQUIRES_COMPENSATION'
});
// Invariante necessária: CONFIRMED => pagamento autorizado E estoque reservado.
// Não cria atomicidade entre serviços externos.
export function decideOrderStatus(paymentStatus, stockStatus) {
  if (paymentStatus === 'AUTHORIZED' && stockStatus === 'RESERVED') {
    return OrderStatus.CONFIRMED;
  }
  if (paymentStatus === 'AUTHORIZED' && stockStatus === 'FAILED') {
    return OrderStatus.REQUIRES_COMPENSATION;
  }
  return OrderStatus.PENDING;
}
