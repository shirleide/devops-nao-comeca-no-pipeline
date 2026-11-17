# Fluxos CI/CD com gates de negócio

**CI** (`.github/workflows/ci.yml`): push em `main` ou `fase/**`, PR e execução manual.

`checkout → setup Node 24 → npm ci → npm run check → npm test → npm run contract → npm run flow:check → npm run build → artifact`.

Na fase 01 o CI pode ficar verde apesar do bug porque seus testes são insuficientes. A fase 03 deve ficar vermelha intencionalmente, ao adicionar um teste da reserva de estoque. As fases anteriores à 08 não possuem o comando `flow:check` porque ele foi introduzido na fase 08.

**CD** (`.github/workflows/cd.yml`): apenas `main`, tags `v*` e manual. O job `verify` repete os gates. O job `publish` requer **Actions variable PUBLISH_IMAGE=true**. O job `deploy` exige **DEPLOY_ENABLED=true** e `DEPLOY_HOOK_URL` no environment `production`.

**Por padrão:** só valida; não publica imagem nem solicita deploy externo. O pacote no GHCR tem controle de visibilidade independente do repositório público. O hook apenas solicita o deploy; validar a saúde no provedor é uma etapa separada.

Configure proteção da main conforme o fluxo de contribuição; nenhuma das fases didáticas deve servir como código de produção.
