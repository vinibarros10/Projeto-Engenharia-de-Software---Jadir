// ==============================
// Dashboard - Smile Up (dados fixos)
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  // Primeiro, cria os dados simulados
  carregarDadosFixos();

  // Depois verifica login e atualiza o painel
  verificarLogin();
  atualizarDashboard();
});

// Cria dados de exemplo (independe de cadastros)
function carregarDadosFixos() {
  const pacientes = [
    {
      nome: "João Silva",
      cpf: "123.456.789-10",
      telefone: "(11) 91234-5678",
      nascimento: "1985-06-20",
      endereco: "Rua das Flores, 123 - São Paulo/SP",
    },
    {
      nome: "Maria Oliveira",
      cpf: "987.654.321-00",
      telefone: "(11) 99876-5432",
      nascimento: "1990-10-05",
      endereco: "Av. Paulista, 800 - São Paulo/SP",
    },
  ];

  const dentistas = [
    {
      nome: "Dra. Fernanda Costa",
      cro: "CRO-SP 12345",
      especialidade: "Ortodontia",
      status: "Ativo",
    },
  ];

  const consultas = [
    {
      id_paciente: "123.456.789-10",
      id_dentista: "CRO-SP 12345",
      dataHora: "2025-11-15T14:00",
      status: "Agendada",
    },
    {
      id_paciente: "987.654.321-00",
      id_dentista: "CRO-SP 12345",
      dataHora: "2025-11-20T09:30",
      status: "Confirmada",
    },
  ];

  const pagamentos = [
    { valor: 250.0, data_pagamento: "2025-11-08" },
    { valor: 480.0, data_pagamento: "2025-11-02" },
  ];

  localStorage.setItem("pacientes", JSON.stringify(pacientes));
  localStorage.setItem("dentistas", JSON.stringify(dentistas));
  localStorage.setItem("consultas", JSON.stringify(consultas));
  localStorage.setItem("pagamentos", JSON.stringify(pagamentos));
}

// Atualiza informações do Dashboard
function atualizarDashboard() {
  atualizarContadores();
  carregarProximasConsultas();
}

// Atualiza contadores
function atualizarContadores() {
  const pacientes = JSON.parse(localStorage.getItem("pacientes") || "[]");
  const consultas = JSON.parse(localStorage.getItem("consultas") || "[]");
  const pagamentos = JSON.parse(localStorage.getItem("pagamentos") || "[]");

  const receitaTotal = pagamentos.reduce((soma, p) => soma + (parseFloat(p.valor) || 0), 0);

  document.getElementById("totalPacientes").textContent = pacientes.length;
  document.getElementById("totalConsultas").textContent = consultas.length;
  document.getElementById("totalReceita").textContent = formatarMoeda(receitaTotal);
}

// Lista próximas consultas
function carregarProximasConsultas() {
  const consultas = JSON.parse(localStorage.getItem("consultas") || "[]");
  const pacientes = JSON.parse(localStorage.getItem("pacientes") || "[]");
  const dentistas = JSON.parse(localStorage.getItem("dentistas") || "[]");
  const tabela = document.getElementById("listaProximasConsultas");

  tabela.innerHTML = "";

  const agora = new Date();

  const futuras = consultas
    .filter(c => new Date(c.dataHora) >= agora && c.status !== "Cancelada")
    .sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora))
    .slice(0, 5);

  if (futuras.length === 0) {
    tabela.innerHTML = `<tr><td colspan="4" class="text-center text-muted">Nenhuma consulta agendada</td></tr>`;
    return;
  }

  futuras.forEach(c => {
    const paciente = pacientes.find(p => p.cpf === c.id_paciente)?.nome || "Desconhecido";
    const dentista = dentistas.find(d => d.cro === c.id_dentista)?.nome || "Desconhecido";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${paciente}</td>
      <td>${dentista}</td>
      <td>${formatarDataHora(c.dataHora)}</td>
      <td>${c.status}</td>
    `;
    tabela.appendChild(tr);
  });
}

// ======= Funções auxiliares =======
function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarDataHora(dataHora) {
  const d = new Date(dataHora);
  return isNaN(d)
    ? "-"
    : d.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
}
