import test from 'node:test';
import assert from 'node:assert/strict';
import {createOrderService} from '../src/application/order-service.js';
// Os testes só cobrem o caminho feliz. O bug permanece invisível!
test('confirma pedido com pagamento autorizado e reserva concluída', () => {
  const order = createOrderService().create({sku: 'SKU-DISPONIVEL', quantity: 1});
  assert.equal(order.status, 'CONFIRMED');
  assert.equal(order.stockStatus, 'RESERVED');
});
