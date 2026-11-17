import test from 'node:test';
import assert from 'node:assert/strict';
import {once} from 'node:events';
import {createApp} from '../src/http/app.js';

async function start() {
  const server = createApp().listen(0, '127.0.0.1');
  await once(server, 'listening');
  return {server, base: 'http://127.0.0.1:' + server.address().port};
}
async function create(base, sku) {
  const response = await fetch(base + '/orders', {
    method: 'POST', headers: {'content-type': 'application/json'},
    body: JSON.stringify({sku, quantity: 1})
  });
  return {response, order: await response.json()};
}
test('lista os cinco cenários didáticos', async () => {
  const {server, base} = await start();
  try {
    const response = await fetch(base + '/scenarios');
    assert.equal(response.status, 200);
    assert.equal((await response.json()).scenarios.length, 5);
  } finally {await new Promise(r => server.close(r));}
});
test('timeline revela falha de estoque sem confirmar', async () => {
  const {server, base} = await start();
  try {
    const {order} = await create(base, 'SKU-SEM-ESTOQUE');
    const response = await fetch(base + '/orders/' + order.id + '/flow');
    assert.equal(response.status, 200);
    const flow = await response.json();
    assert.equal(flow.status, 'REQUIRES_COMPENSATION');
    assert.equal(flow.steps.find(s => s.stage === 'STOCK').result, 'FAILED');
    assert.equal(flow.steps.find(s => s.stage === 'DOMAIN_RULE').result, 'BLOCKED_OR_DEFERRED');
  } finally {await new Promise(r => server.close(r));}
});
test('pagamento negado e inconclusivo não disparam reserva', async () => {
  const {server, base} = await start();
  try {
    for (const [sku, expected] of [
      ['SKU-PAGAMENTO-NEGADO', 'REJECTED'],
      ['SKU-PAGAMENTO-PENDENTE', 'PENDING']
    ]) {
      const {order} = await create(base, sku);
      assert.equal(order.status, expected);
      assert.equal(order.stockStatus, 'NOT_ATTEMPTED');
    }
  } finally {await new Promise(r => server.close(r));}
});
test('falha de validação HTTP 400 ocorre antes de registrar pedido', async () => {
  const {server, base} = await start();
  try {
    const response = await fetch(base + '/orders', {
      method: 'POST', headers: {'content-type': 'application/json'},
      body: JSON.stringify({sku: 'SKU-DISPONIVEL', quantity: -1})
    });
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), {error: 'INVALID_ORDER'});
    const metrics = await (await fetch(base + '/metrics')).text();
    assert.match(metrics, /orders_created_total 0/);
  } finally {await new Promise(r => server.close(r));}
});
