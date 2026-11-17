# Publicar a demo no GitHub Pages

A demo é **estática**, sem backend hospedado e sem conexão com meios de pagamento, estoque ou dados pessoais. Ela compara de forma determinística o comportamento das regras de domínio das fases 01 e 04/main.

## Ativar com poucos cliques

1. Acesse [Settings → Pages](https://github.com/shirleide/devops-nao-comeca-no-pipeline/settings/pages).
2. Em **Build and deployment**, escolha **Source: Deploy from a branch**.
3. Selecione **Branch: main** e **Folder: /docs**.
4. Clique em **Save**.
5. Quando o GitHub confirmar a publicação, a página estará em:

**https://shirleide.github.io/devops-nao-comeca-no-pipeline/**

O endereço acima é o **endereço esperado**, não uma afirmação de que a página já está no ar.

## Arquivos do site

- `docs/index.html`: interface, acessibilidade e links de evidências;
- `docs/demo.css`: tema escuro Shirleide.dev e responsividade;
- `docs/demo.js`: cinco cenários determinísticos; duas regras comparadas;
- `docs/.nojekyll`: serve os arquivos diretamente, sem processamento Jekyll.

## O que é real e o que é simulado?

| Componente | Tipo |
|---|---|
| Execuções CI 01, 03, 04 e main, seus resultados e links | Resultados reais do GitHub Actions |
| Lógica da condição de confirmação da fase 01 e main | Espelha as decisões do código-fonte |
| Pagamento, estoque, criação dos pedidos e timeline no navegador | **Simulação local determinística**, não API Node |
| Publicação de imagem / deploy de backend | Desabilitado por padrão nos workflows existentes |

## Cenários didáticos

- `SKU-SEM-ESTOQUE`: pagamento autorizado, estoque `FAILED`; bug retorna `CONFIRMED`; corrigido retorna `REQUIRES_COMPENSATION`.
- `SKU-PENDENTE`: pagamento autorizado, reserva `PENDING`; bug retorna `CONFIRMED`; corrigido retorna `PENDING`.
- `SKU-DISPONIVEL`: pagamento e estoque aprovados; ambas confirmam.
- `SKU-PAGAMENTO-NEGADO`: negado; corrigido retorna `REJECTED`; bug original retorna `PENDING`.
- `SKU-PAGAMENTO-PENDENTE`: pendente; ambas mantêm `PENDING`.

O estado `REQUIRES_COMPENSATION` **não significa estorno executado**.

## Rodar sem GitHub Pages (offline)

Na pasta do projeto, use um servidor de arquivos estáticos para carregar a página:

```bash
python3 -m http.server 8080 --directory docs
# abra http://localhost:8080
```

Como os arquivos não dependem de APIs externas ou fontes online, a interface também serve para uma demonstração offline no auditório. Não adicione tokens ou segredos a `docs/`, pois esse diretório é público.

## Roteiro da demo em até 2 minutos

1. 0:00–0:20 — abra o cenário padrão `SKU-SEM-ESTOQUE` e aponte os dois resultados.
2. 0:20–0:50 — selecione `SKU-PENDENTE`; observe o bug `CONFIRMED` e a versão corrigida `PENDING`.
3. 0:50–1:30 — abra os links de CI verde → vermelho → verde.
4. 1:30–2:00 — destaque `AUTHORIZED && RESERVED` e feche: *pipeline é uma ferramenta; confiabilidade começa na regra protegida*.

**Observação:** não habilite publicação de imagem Docker só para demonstrar esta página: o Pages serve os arquivos da pasta `docs/` e não depende do workflow CD da API.
