import {randomUUID} from 'node:crypto';
import {decideOrderStatus, OrderStatus} from '../domain/order.js';
import {authorizePayment, reserveStock} from '../infrastructure/fakes.js';
export function createOrderService({payment = authorizePayment, stock = reserveStock} = {}) {
  const orders = new Map();
  function create({sku, quantity}) {
    const paymentStatus = payment({sku, quantity});
    const stockStatus = paymentStatus === 'AUTHORIZED' ? stock({sku, quantity}) : 'NOT_ATTEMPTED';
    const status = decideOrderStatus(paymentStatus, stockStatus);
    const order = {
      id: randomUUID(), sku, quantity, paymentStatus, stockStatus, status,
      compensationRequired: status === OrderStatus.REQUIRES_COMPENSATION
    };
    orders.set(order.id, order);
    return order;
  }
  return {create, getById: id => orders.get(id)};
}
