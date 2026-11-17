# CI/CD do case — GitHub Actions

## CI

O workflow CI executa nas branches main e fase/** e nos pull requests:

checkout → Node 24 → npm ci → checagem de sintaxe → testes → contrato → build → artefato.

A fase 01 tem CI verde com erro de domínio. A fase 03 deve falhar por um teste novo. A fase 04 corrige o código e recupera o verde.

## CD

O workflow CD verifica a main; só publica imagem Docker no GHCR quando a variável Actions PUBLISH_IMAGE estiver explicitamente configurada com true. Deploy externo exige DEPLOY_ENABLED=true e segredo DEPLOY_HOOK_URL em environment production.

A visibilidade do pacote GHCR é independente da visibilidade do repositório. Um deploy hook não é comprovação de que a aplicação está saudável: valide no provedor.

Somente a main e tags v* disparam o CD automaticamente; as branches didáticas não realizam deploy.
