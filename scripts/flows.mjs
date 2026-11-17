import {createOrderService} from '../src/application/order-service.js';
import {scenarios} from '../src/domain/scenarios.js';

const service = createOrderService();
console.log('CASE FICTÍCIO — ETAPAS DO FLUXO IDEAL E CENÁRIOS DE FALHA');
for (const scenario of scenarios) {
  const order = service.create({sku: scenario.sku, quantity: 1});
  const flow = service.getFlowById(order.id);
  console.log('\n' + scenario.name + ' / ' + scenario.sku + ' => ' + order.status);
  for (const step of flow.steps) console.log('  ' + step.stage.padEnd(13) + step.result.padEnd(23) + step.detail);
  console.log('  Lição: ' + scenario.lesson);
}
console.log('\nEntrada inválida: POST /orders com quantity:-1 retorna HTTP 400.');
console.log('Bug original: git switch fase/01-pipeline-verde-bug && npm run demo');
console.log('Teste vermelho: git switch fase/03-teste-vermelho && npm test');
