import assert from 'node:assert/strict';
import {appendFileSync} from 'node:fs';
import {createOrderService} from '../src/application/order-service.js';
import {scenarios} from '../src/domain/scenarios.js';

const service = createOrderService();
let summary = '### Gate de negócio — pedidos fictícios\n\n| Cenário | Estado | Resultado |\n| --- | --- | --- |\n';
for (const scenario of scenarios) {
  const order = service.create({sku: scenario.sku, quantity: 1});
  assert.equal(order.status, scenario.expectedStatus);
  assert.ok(order.status !== 'CONFIRMED' ||
    (order.paymentStatus === 'AUTHORIZED' && order.stockStatus === 'RESERVED'));
  assert.equal(order.compensationRequired, order.status === 'REQUIRES_COMPENSATION');
  const flow = service.getFlowById(order.id);
  assert.deepEqual(flow.steps.map(step => step.stage),
    ['REQUEST', 'PAYMENT', 'STOCK', 'DOMAIN_RULE', 'ORDER_STATE']);
  if (order.paymentStatus !== 'AUTHORIZED') assert.equal(order.stockStatus, 'NOT_ATTEMPTED');
  if (['FAILED', 'PENDING'].includes(order.stockStatus)) assert.notEqual(order.status, 'CONFIRMED');
  console.log('✓ ' + scenario.sku + ': ' + order.status);
  summary += '| ' + scenario.name + ' | ' + order.status + ' | ✓ |\n';
}
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
console.log('✓ Gate de comportamento: nenhuma confirmação indevida');
