import {createServer} from 'node:http';
import {createOrderService} from '../application/order-service.js';
function respond(res, code, data, headers = {}) {
  res.writeHead(code, {'content-type': 'application/json; charset=utf-8', ...headers});
  res.end(JSON.stringify(data));
}
async function readJSON(req) {
  let text = '';
  for await (const chunk of req) {
    text += chunk;
    if (text.length > 16384) throw Object.assign(new Error('Body muito grande'), {code: 413});
  }
  try {return JSON.parse(text);}
  catch {throw Object.assign(new Error('JSON inválido'), {code: 400});}
}
export function createApp({orders = createOrderService()} = {}) {
  return createServer(async (req, res) => {
    const path = new URL(req.url, 'http://localhost').pathname;
    if (req.method === 'GET' && path === '/health') return respond(res, 200, {status: 'UP'});
    if (req.method === 'GET' && path.startsWith('/orders/')) {
      const order = orders.getById(path.substring('/orders/'.length));
      return order ? respond(res, 200, order) : respond(res, 404, {error: 'ORDER_NOT_FOUND'});
    }
    if (req.method === 'POST' && path === '/orders') {
      if (!req.headers['content-type']?.startsWith('application/json')) return respond(res, 415, {error: 'UNSUPPORTED_MEDIA_TYPE'});
      try {
        const body = await readJSON(req);
        if (typeof body?.sku !== 'string' || !/^SKU-[A-Z-]{1,45}$/.test(body.sku) ||
            !Number.isInteger(body?.quantity) || body.quantity < 1 || body.quantity > 100) {
          return respond(res, 400, {error: 'INVALID_ORDER'});
        }
        const order = orders.create({sku: body.sku, quantity: body.quantity});
        return respond(res, 201, order, {location: '/orders/' + order.id});
      } catch (error) {
        const code = [400, 413].includes(error.code) ? error.code : 500;
        return respond(res, code, {error: code === 413 ? 'PAYLOAD_TOO_LARGE' : code === 400 ? 'INVALID_JSON' : 'INTERNAL_ERROR'});
      }
    }
    return respond(res, 404, {error: 'NOT_FOUND'});
  });
}
