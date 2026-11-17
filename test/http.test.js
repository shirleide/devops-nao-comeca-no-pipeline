import test from 'node:test';
import assert from 'node:assert/strict';
import {once} from 'node:events';
import {createApp} from '../src/http/app.js';
async function startApp() {
  const server = createApp().listen(0, '127.0.0.1');
  await once(server, 'listening');
  return {server, base: 'http://127.0.0.1:' + server.address().port};
}
test('healthcheck devolve HTTP 200', async () => {
  const {server, base} = await startApp();
  try {
    assert.deepEqual(await (await fetch(base + '/health')).json(), {status: 'UP'});
  } finally {await new Promise(resolve => server.close(resolve));}
});
test('201 pode representar pedido criado e consulta permite ler o estado', async () => {
  const {server, base} = await startApp();
  try {
    const response = await fetch(base + '/orders', {
      method: 'POST', headers: {'content-type': 'application/json'},
      body: JSON.stringify({sku: 'SKU-DISPONIVEL', quantity: 1})
    });
    assert.equal(response.status, 201);
    const order = await response.json();
    assert.equal(order.status, 'CONFIRMED');
    const query = await fetch(base + response.headers.get('location'));
    assert.deepEqual(await query.json(), order);
  } finally {await new Promise(resolve => server.close(resolve));}
});
test('201 não mente sobre falta de estoque e não confirma pedido', async () => {
  const {server, base} = await startApp();
  try {
    const response = await fetch(base + '/orders', {
      method: 'POST', headers: {'content-type': 'application/json'},
      body: JSON.stringify({sku: 'SKU-SEM-ESTOQUE', quantity: 1})
    });
    assert.equal(response.status, 201);
    const order = await response.json();
    assert.equal(order.status, 'REQUIRES_COMPENSATION');
    assert.equal(order.stockStatus, 'FAILED');
    assert.equal(order.compensationRequired, true);
  } finally {await new Promise(resolve => server.close(resolve));}
});
test('HTTP 400 para entradas inválidas e 404 para pedido inexistente', async () => {
  const {server, base} = await startApp();
  try {
    const response = await fetch(base + '/orders', {
      method: 'POST', headers: {'content-type': 'application/json'},
      body: JSON.stringify({sku: 'SKU-DISPONIVEL', quantity: -3})
    });
    assert.equal(response.status, 400);
    assert.equal((await fetch(base + '/orders/absent')).status, 404);
  } finally {await new Promise(resolve => server.close(resolve));}
});
