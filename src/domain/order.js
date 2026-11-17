export const OrderStatus = Object.freeze({
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  REQUIRES_COMPENSATION: 'REQUIRES_COMPENSATION'
});
// BUG INTENCIONAL DA FASE 01: ignora o resultado da reserva de estoque.
export function decideOrderStatus(paymentStatus, stockStatus) {
  if (paymentStatus === 'AUTHORIZED') return OrderStatus.CONFIRMED;
  return OrderStatus.PENDING;
}
