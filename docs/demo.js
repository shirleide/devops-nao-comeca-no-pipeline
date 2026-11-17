// Demo didática: estado local no navegador; não consulta a API Node nem processa pagamentos.
const scenarios = Object.freeze({
  "SKU-SEM-ESTOQUE": {title:"Estoque indisponível", subtitle:"Pagamento autorizado, reserva de estoque falha.", payment:"AUTHORIZED", stock:"FAILED", reason:"O pedido não pode ser confirmado; requer compensação financeira posterior."},
  "SKU-PENDENTE": {title:"Reserva inconclusiva", subtitle:"Pagamento autorizado, estoque ainda pendente.", payment:"AUTHORIZED", stock:"PENDING", reason:"Sem confirmação da reserva, o pedido deve continuar pendente."},
  "SKU-DISPONIVEL": {title:"Caminho feliz", subtitle:"Pagamento autorizado e estoque reservado.", payment:"AUTHORIZED", stock:"RESERVED", reason:"Pagamento e estoque validam a confirmação."},
  "SKU-PAGAMENTO-NEGADO": {title:"Pagamento negado", subtitle:"Pagamento negado; estoque não deve ser consultado.", payment:"DENIED", stock:"NOT_ATTEMPTED", reason:"Sem autorização financeira, a versão corrigida rejeita o pedido."},
  "SKU-PAGAMENTO-PENDENTE": {title:"Pagamento pendente", subtitle:"Pagamento não concluído; estoque não é tentado.", payment:"PENDING", stock:"NOT_ATTEMPTED", reason:"Aguardar resolução do pagamento sem confirmar o pedido."}
});
const messages = Object.freeze({
  CONFIRMED:"Pedido marcado como confirmado.",
  PENDING:"Aguardando definição; sem confirmação.",
  REJECTED:"Pagamento negado. Nenhuma reserva foi solicitada.",
  REQUIRES_COMPENSATION:"Reserva falhou após autorização. Compensação é necessária, mas não foi executada."
});
function decideBug(payment, stock) {
  // Cópia da lógica didática da fase/01 (domínio): estoque ignorado.
  return payment === "AUTHORIZED" ? "CONFIRMED" : "PENDING";
}
function decideFixed(payment, stock) {
  // Equivalente à regra de domínio da main; sem transações reais.
  if (payment === "DENIED") return "REJECTED";
  if (payment === "AUTHORIZED" && stock === "RESERVED") return "CONFIRMED";
  if (payment === "AUTHORIZED" && stock === "FAILED") return "REQUIRES_COMPENSATION";
  return "PENDING";
}
function simulate(scenario, variant) {
  const payment=scenario.payment, stock=scenario.stock;
  const status=variant === "bug" ? decideBug(payment,stock) : decideFixed(payment,stock);
  const falseConfirmation = status==="CONFIRMED" && (payment!=="AUTHORIZED" || stock!=="RESERVED");
  const steps=[
    {name:"REQUEST", value:"ACCEPTED", detail:"Pedido recebido: 1 unidade do SKU selecionado."},
    {name:"PAYMENT", value:payment, detail:payment==="AUTHORIZED"?"Autorização simulada concluída.":payment==="DENIED"?"Pagamento recusado.":"Pagamento ainda sem resultado definitivo."},
    {name:"STOCK", value:stock, detail:stock==="RESERVED"?"Reserva concluída.":stock==="FAILED"?"Reserva indisponível.":stock==="PENDING"?"Resultado da reserva ainda indefinido.":"Não tentada porque o pagamento não foi autorizado."},
    {name:"DOMAIN_RULE", value:falseConfirmation?"VIOLATED":status==="CONFIRMED"?"PASSED":"BLOCKED / DEFERRED",detail:variant==="bug"?"Regra desta fase considera apenas pagamento autorizado.":"Regra exige pagamento AUTHORIZED e estoque RESERVED para confirmar."},
    {name:"ORDER_STATE", value:status,detail:messages[status]}
  ];
  return {status,falseConfirmation,steps};
}
const $=id=>document.getElementById(id);
function renderCard(prefix,result) {
  const state=$(prefix+"-state");
  const panel=$(prefix+"-status");
  const alert=$(prefix+"-alert");
  state.textContent=result.status;
  panel.classList.remove("good","bad","warn");
  const appearance=result.falseConfirmation?"bad":result.status==="CONFIRMED"?"good":result.status==="REQUIRES_COMPENSATION"?"warn":"good";
  panel.classList.add(appearance);
  alert.textContent=result.falseConfirmation
    ?"INVARIANTE VIOLADA: CONFIRMED sem reserva de estoque."
    :result.status==="REQUIRES_COMPENSATION"
    ?"Pedido não confirmado. Compensação necessária, ainda não realizada."
    :"Resultado consistente com a regra desta versão.";
  const target=$(prefix+"-steps");
  target.replaceChildren();
  for(const [idx,step] of result.steps.entries()){
    const item=document.createElement("li");
    const dot=document.createElement("span");
    dot.className="step-dot"; dot.textContent=String(idx+1); dot.setAttribute("aria-hidden","true");
    const content=document.createElement("div"); content.className="step-content";
    const top=document.createElement("div"); top.className="step-top";
    const strong=document.createElement("strong");strong.textContent=step.name;
    const code=document.createElement("code");code.textContent=step.value;
    if(step.value==="VIOLATED")code.classList.add("bad");
    top.append(strong,code);
    const p=document.createElement("p");p.textContent=step.detail;
    content.append(top,p);item.append(dot,content);target.append(item);
  }
}
function run(){
  const key=$("scenario").value;
  const input=scenarios[key] || scenarios["SKU-SEM-ESTOQUE"];
  $("scenario-title").textContent=input.title;
  $("scenario-description").textContent=input.subtitle;
  $("scenario-rule").textContent=input.reason;
  renderCard("bug",simulate(input,"bug"));
  renderCard("fixed",simulate(input,"fixed"));
  $("comparison-description").textContent=input.payment==="AUTHORIZED" && input.stock!=="RESERVED"
    ?"O bug permitia confirmar sem estoque reservado. A versão corrigida bloqueia essa transição."
    :input.payment==="DENIED"
    ?"A versão inicial tratava o pagamento negado como pendente. A versão corrigida o rejeita explicitamente."
    :input.payment==="PENDING"
    ?"Ambas mantêm o pedido pendente: a falha principal aparece quando há pagamento autorizado sem estoque reservado."
    :"Neste cenário as duas versões confirmam o pedido. O problema aparece nos caminhos alternativos.";
}
$("run").addEventListener("click",run);
$("scenario").addEventListener("change",run);
run();
