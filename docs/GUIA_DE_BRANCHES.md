# Branches da demonstração

A sequência é acumulativa: cada branch aponta para um commit que inclui o trabalho das fases anteriores. O histórico de desenvolvimento fica preservado no Git, e a main aponta para a versão completa corrigida.

```bash
git log --oneline --all --graph
git diff fase/01-pipeline-verde-bug..fase/03-teste-vermelho
git diff fase/03-teste-vermelho..fase/04-invariante-corrigida
git switch main
npm ci && npm test && npm run flow:check
```

A fase 03 falha intencionalmente. Isso não é uma regressão inesperada na branch principal.
