document.addEventListener("DOMContentLoaded", () => {
  carregarDadosFixos();
  carregarSelects();
  carregarTratamentos();

  document.getElementById("formTratamento").addEventListener("submit", salvarTratamento);
});

function carregarDadosFixos() {
  // Dados fixos simulando registros
  const pacientes = [
    { nome: "João Silva", cpf: "123.456.789-10" },
    { nome: "Maria Oliveira", cpf: "987.654.321-00" }
  ];

  const dentistas = [
    { nome: "Dra. Fernanda Costa", cro: "CRO-SP 12345" },
    { nome: "Dr. Pedro Santos", cro: "CRO-SP 67890" }
  ];

  const tratamentos = [
    {
      paciente: "João Silva",
      dentista: "Dra. Fernanda Costa",
      descricao: "Limpeza e profilaxia",
      valor: 200,
      status: "Concluído"
    },
    {
      paciente: "Maria Oliveira",
      dentista: "Dr. Pedro Santos",
      descricao: "Extração do siso",
      valor: 500,
      status: "Pendente"
    }
  ];

  // salva tudo no localStorage (para outras telas acessarem também)
  localStorage.setItem("pacientes", JSON.stringify(pacientes));
  localStorage.setItem("dentistas", JSON.stringify(dentistas));
  localStorage.setItem("tratamentos", JSON.stringify(tratamentos));
}

function carregarSelects() {
  const pacientes = JSON.parse(localStorage.getItem("pacientes") || "[]");
  const dentistas = JSON.parse(localStorage.getItem("dentistas") || "[]");

  const selectPacientes = document.getElementById("paciente");
  const selectDentistas = document.getElementById("dentista");

  selectPacientes.innerHTML = pacientes.map(p => `<option value="${p.nome}">${p.nome}</option>`).join("");
  selectDentistas.innerHTML = dentistas.map(d => `<option value="${d.nome}">${d.nome}</option>`).join("");
}

function carregarTratamentos() {
  const tratamentos = JSON.parse(localStorage.getItem("tratamentos") || "[]");
  const tbody = document.getElementById("listaTratamentos");

  tbody.innerHTML = "";

  if (tratamentos.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Nenhum tratamento registrado</td></tr>`;
    return;
  }

  tratamentos.forEach(t => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${t.paciente}</td>
      <td>${t.dentista}</td>
      <td>${t.descricao}</td>
      <td>${formatarMoeda(t.valor)}</td>
      <td>${t.status}</td>
    `;
    tbody.appendChild(tr);
  });
}

function salvarTratamento(e) {
  e.preventDefault();

  const paciente = document.getElementById("paciente").value;
  const dentista = document.getElementById("dentista").value;
  const descricao = document.getElementById("descricao").value;
  const valor = parseFloat(document.getElementById("valor").value) || 0;
  const status = document.getElementById("status").value;

  const tratamentos = JSON.parse(localStorage.getItem("tratamentos") || "[]");

  tratamentos.push({ paciente, dentista, descricao, valor, status });

  localStorage.setItem("tratamentos", JSON.stringify(tratamentos));
  carregarTratamentos();

  document.getElementById("formTratamento").reset();
}

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
