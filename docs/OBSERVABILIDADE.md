# Observabilidade do case

- `GET /health`: liveness da API.
- `GET /metrics`: contadores didáticos sem labels de pedido ou cliente.
- Logs estruturados de estado, pagamento e estoque; sem dados pessoais.

O indicador **orders_confirmed_without_reservation_total** deve permanecer em zero. Em sistemas reais, eventos atrasados e reconciliação exigem tratamento específico para evitar falsos positivos.
