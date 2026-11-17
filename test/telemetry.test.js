import test from 'node:test';
import assert from 'node:assert/strict';
import {createOrderService} from '../src/application/order-service.js';
import {createTelemetry} from '../src/infrastructure/telemetry.js';

test('métrica de confirmação sem reserva permanece zero', () => {
  const telemetry = createTelemetry({logger: () => {}});
  const service = createOrderService();
  telemetry.record(service.create({sku: 'SKU-DISPONIVEL', quantity: 1}));
  telemetry.record(service.create({sku: 'SKU-SEM-ESTOQUE', quantity: 1}));
  const metrics = telemetry.metrics();
  assert.match(metrics, /orders_confirmed_without_reservation_total 0/);
  assert.doesNotMatch(metrics, /order_id=|customer_id=/);
});
