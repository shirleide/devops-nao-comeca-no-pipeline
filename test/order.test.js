import test from 'node:test';
import assert from 'node:assert/strict';
import {createOrderService} from '../src/application/order-service.js';

test('confirma pedido com pagamento autorizado e reserva concluída', () => {
  const order = createOrderService().create({sku: 'SKU-DISPONIVEL', quantity: 1});
  assert.equal(order.status, 'CONFIRMED');
  assert.equal(order.stockStatus, 'RESERVED');
});

test('NUNCA confirma quando o estoque falha', () => {
  const order = createOrderService().create({sku: 'SKU-SEM-ESTOQUE', quantity: 1});
  assert.equal(order.paymentStatus, 'AUTHORIZED');
  assert.equal(order.stockStatus, 'FAILED');
  assert.notEqual(order.status, 'CONFIRMED');
  assert.equal(order.status, 'REQUIRES_COMPENSATION');
});

test('mantém pedido pendente quando a reserva ainda não terminou', () => {
  const order = createOrderService().create({sku: 'SKU-PENDENTE', quantity: 1});
  assert.equal(order.status, 'PENDING');
});
