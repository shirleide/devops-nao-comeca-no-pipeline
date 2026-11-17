import {createApp} from '../src/http/app.js';
import {once} from 'node:events';
const server = createApp().listen(0, '127.0.0.1');
await once(server, 'listening');
const base = 'http://127.0.0.1:' + server.address().port;
try {
  for (const sku of ['SKU-DISPONIVEL', 'SKU-SEM-ESTOQUE', 'SKU-PENDENTE']) {
    const response = await fetch(base + '/orders', {
      method: 'POST', headers: {'content-type': 'application/json'},
      body: JSON.stringify({sku, quantity: 1})
    });
    const order = await response.json();
    console.log(response.status, sku, 'payment=', order.paymentStatus, 'stock=', order.stockStatus, 'order=', order.status);
  }
} finally {server.close();}
