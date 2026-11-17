export const OrderStatus = Object.freeze({
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  REJECTED: 'REJECTED',
  REQUIRES_COMPENSATION: 'REQUIRES_COMPENSATION'
});
// Invariante: CONFIRMED => pagamento autorizado E estoque reservado.
// Este exemplo NÃO implementa atomicidade ou compensação distribuída automática.
export function decideOrderStatus(paymentStatus, stockStatus) {
  if (paymentStatus === 'DENIED') return OrderStatus.REJECTED;
  if (paymentStatus === 'AUTHORIZED' && stockStatus === 'RESERVED') {
    return OrderStatus.CONFIRMED;
  }
  if (paymentStatus === 'AUTHORIZED' && stockStatus === 'FAILED') {
    return OrderStatus.REQUIRES_COMPENSATION;
  }
  return OrderStatus.PENDING;
}
