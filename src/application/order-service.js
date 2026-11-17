import {randomUUID} from 'node:crypto';
import {decideOrderStatus, OrderStatus} from '../domain/order.js';
import {authorizePayment, reserveStock} from '../infrastructure/fakes.js';

const ruleMessage = Object.freeze({
  CONFIRMED: 'Pagamento e reserva concluídos; confirmação permitida.',
  REJECTED: 'Pagamento negado; confirmação proibida.',
  PENDING: 'Existe etapa sem resultado definitivo; não confirmar.',
  REQUIRES_COMPENSATION: 'Reserva falhou após autorização; compensação pendente, não executada.'
});
export function createOrderService({payment = authorizePayment, stock = reserveStock} = {}) {
  const orders = new Map();
  const timelines = new Map();
  function create({sku, quantity}) {
    const steps = [];
    function record(stage, result, detail) {
      steps.push({number: steps.length + 1, stage, result, detail});
    }
    record('REQUEST', 'ACCEPTED', 'Pedido aceito na simulação.');
    const paymentStatus = payment({sku, quantity});
    record('PAYMENT', paymentStatus, paymentStatus === 'DENIED'
      ? 'Pagamento recusado; não tentar reserva.'
      : paymentStatus === 'PENDING' ? 'Pagamento sem resultado definitivo.' : 'Pagamento autorizado.');
    const stockStatus = paymentStatus === 'AUTHORIZED' ? stock({sku, quantity}) : 'NOT_ATTEMPTED';
    record('STOCK', stockStatus, stockStatus === 'FAILED'
      ? 'Reserva recusada; pedido não confirmado.'
      : stockStatus === 'PENDING' ? 'Reserva inconclusiva; aguardar.'
      : stockStatus === 'NOT_ATTEMPTED' ? 'Sem autorização, não reservar.' : 'Estoque reservado.');
    const status = decideOrderStatus(paymentStatus, stockStatus);
    record('DOMAIN_RULE', status === 'CONFIRMED' ? 'PASSED' : 'BLOCKED_OR_DEFERRED', ruleMessage[status]);
    record('ORDER_STATE', status, 'Estado do pedido na simulação: ' + status);
    const order = {
      id: randomUUID(), sku, quantity, paymentStatus, stockStatus, status,
      compensationRequired: status === OrderStatus.REQUIRES_COMPENSATION
    };
    orders.set(order.id, order);
    timelines.set(order.id, {orderId: order.id, status, steps});
    return order;
  }
  return {create, getById: id => orders.get(id), getFlowById: id => timelines.get(id)};
}
