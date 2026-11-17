# Regra de negócio (caso fictício)

> **CONFIRMED ⇒ paymentStatus=AUTHORIZED E stockStatus=RESERVED**

A implicação é uma condição necessária; o inverso não foi afirmado.

Caminhos:
- **AUTHORIZED + RESERVED:** CONFIRMED;
- **AUTHORIZED + FAILED:** não confirmar; avaliar cancelamento de autorização ou compensação;
- **AUTHORIZED + PENDING:** PENDING, até resultado confiável;
- **DENIED:** REJECTED, sem reservar;
- **pagamento inconclusivo:** PENDING, sem reservar.

O pipeline verifica as regras que especificamos e testamos. A correção em sistemas distribuídos também exige idempotência, timeouts, retries e reconciliação.
