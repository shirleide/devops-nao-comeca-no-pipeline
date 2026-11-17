import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {OrderStatus} from '../src/domain/order.js';

const spec = JSON.parse(readFileSync('docs/openapi.json', 'utf8'));
assert.equal(spec.openapi, '3.0.3');
assert.ok(spec.paths['/orders'].post.responses['201']);
assert.ok(spec.paths['/orders/{id}'].get.responses['200']);
assert.ok(spec.paths['/orders/{id}/flow'].get.responses['200']);
assert.ok(spec.paths['/scenarios'].get.responses['200']);
assert.deepEqual(new Set(spec.components.schemas.Order.properties.status.enum),
  new Set(Object.values(OrderStatus)));
assert.deepEqual(new Set(spec.components.schemas.OrderFlow.properties.status.enum),
  new Set(Object.values(OrderStatus)));
assert.deepEqual(new Set(spec.components.schemas.FlowStep.properties.stage.enum),
  new Set(['REQUEST', 'PAYMENT', 'STOCK', 'DOMAIN_RULE', 'ORDER_STATE']));
assert.ok(spec.components.schemas.Order.properties.compensationRequired);
console.log('✓ Contrato OpenAPI e estados consistentes');
