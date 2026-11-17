import test from 'node:test';
import assert from 'node:assert/strict';
import {createOrderService} from '../src/application/order-service.js';
import {scenarios} from '../src/domain/scenarios.js';
import {decideOrderStatus, OrderStatus} from '../src/domain/order.js';

for (const scenario of scenarios) {
  test('cenário ' + scenario.name + ' => ' + scenario.expectedStatus, () => {
    const service = createOrderService();
    const order = service.create({sku: scenario.sku, quantity: 1});
    assert.equal(order.status, scenario.expectedStatus);
    assert.equal(order.compensationRequired, order.status === 'REQUIRES_COMPENSATION');
    assert.ok(order.status !== 'CONFIRMED' ||
      (order.paymentStatus === 'AUTHORIZED' && order.stockStatus === 'RESERVED'));
    const flow = service.getFlowById(order.id);
    assert.deepEqual(flow.steps.map(x => x.stage),
      ['REQUEST', 'PAYMENT', 'STOCK', 'DOMAIN_RULE', 'ORDER_STATE']);
    assert.equal(flow.steps.at(-1).result, order.status);
  });
}
test('pagamento negado não chama estoque', () => {
  let calls = 0;
  const service = createOrderService({
    payment: () => 'DENIED', stock: () => { calls++; return 'RESERVED'; }
  });
  const order = service.create({sku: 'SKU-TESTE', quantity: 1});
  assert.equal(calls, 0);
  assert.equal(order.status, 'REJECTED');
  assert.equal(order.stockStatus, 'NOT_ATTEMPTED');
});
test('pagamento pendente não chama estoque', () => {
  let calls = 0;
  const service = createOrderService({
    payment: () => 'PENDING', stock: () => { calls++; return 'RESERVED'; }
  });
  const order = service.create({sku: 'SKU-TESTE', quantity: 1});
  assert.equal(calls, 0);
  assert.equal(order.status, 'PENDING');
});
test('reserva pendente não autoriza confirmação', () => {
  assert.equal(decideOrderStatus('AUTHORIZED', 'PENDING'), OrderStatus.PENDING);
});
test('nenhuma transição CONFIRMED viola as pré-condições', () => {
  for (const pay of ['AUTHORIZED', 'DENIED', 'PENDING']) {
    for (const stock of ['RESERVED', 'FAILED', 'PENDING', 'NOT_ATTEMPTED']) {
      const status = decideOrderStatus(pay, stock);
      if (status === 'CONFIRMED') {
        assert.equal(pay, 'AUTHORIZED');
        assert.equal(stock, 'RESERVED');
      }
    }
  }
});
