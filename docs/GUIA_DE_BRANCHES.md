# Roteiro de branches — DevOpsDays Recife 2026
- fase/00-bootstrap: estrutura mínima
- fase/01-pipeline-verde-bug: CI verde; a regra de estoque está incorreta e não é testada
- fase/02-requisito-e-estados: invariante e estados documentados
- fase/03-teste-vermelho: teste de regressão identifica o bug (falha esperada)
- fase/04-invariante-corrigida: regra corrigida; teste verde
- fase/05-contrato-api: contrato HTTP e teste de integração
- fase/06-observabilidade: logs e métricas de negócio
- fase/07-ci-cd-completo: workflow de publicação opcional
- fase/08-fluxo-ideal-e-falhas: cenários e timeline por pedido

## Como comparar
git diff fase/01-pipeline-verde-bug..fase/03-teste-vermelho
git diff fase/03-teste-vermelho..fase/04-invariante-corrigida

**Atenção:** versões com erro são intencionais e didáticas; nenhum cliente ou serviço real.
