// Contadores locais didáticos, sem labels individuais e sem persistência.
export function createTelemetry({logger = console.log} = {}) {
  const counts = {created: 0, confirmed: 0, invalidConfirmations: 0};
  return {
    record(order) {
      counts.created++;
      if (order.status === 'CONFIRMED') counts.confirmed++;
      if (order.status === 'CONFIRMED' && order.stockStatus !== 'RESERVED') {
        counts.invalidConfirmations++;
      }
      logger(JSON.stringify({
        event: 'order_created', status: order.status,
        paymentStatus: order.paymentStatus, stockStatus: order.stockStatus
      }));
    },
    metrics() {
      return '# TYPE orders_created_total counter\n' +
        'orders_created_total ' + counts.created + '\n' +
        '# TYPE orders_confirmed_total counter\n' +
        'orders_confirmed_total ' + counts.confirmed + '\n' +
        '# TYPE orders_confirmed_without_reservation_total counter\n' +
        'orders_confirmed_without_reservation_total ' + counts.invalidConfirmations + '\n';
    }
  };
}
