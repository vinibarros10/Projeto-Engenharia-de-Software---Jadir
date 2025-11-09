// ==============================
// Relatórios - Smile Up
// ==============================

function gerarRelatorios() {
  gerarRelatorioConsultas();
  gerarRelatorioReceita();
}

// ---- Consultas por Status ----
function gerarRelatorioConsultas() {
  const consultas = JSON.parse(localStorage.getItem("consultas") || "[]");
  const status = ["Agendada", "Realizada", "Cancelada", "Confirmada"];
  const tabela = document.getElementById("relConsultas");
  tabela.innerHTML = "";

  status.forEach((s) => {
    const count = consultas.filter(
      (c) => (c.status || "").toLowerCase() === s.toLowerCase()
    ).length;
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${s}</td><td>${count}</td>`;
    tabela.appendChild(tr);
  });
}

// ---- Receita Mensal ----
function gerarRelatorioReceita() {
  const pagamentos = JSON.parse(localStorage.getItem("pagamentos") || "[]");
  const meses = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  const valores = new Array(12).fill(0);

  pagamentos.forEach((p) => {
    if (!p.data) return;
    const [dia, mes, ano] = p.data.split("/");
    valores[parseInt(mes) - 1] += parseFloat(p.valor || 0);
  });

  const ctx = document.getElementById("graficoRelatorio")?.getContext("2d");
  if (!ctx) return;

  if (window.graficoRelatorioInstancia)
    window.graficoRelatorioInstancia.destroy();

  window.graficoRelatorioInstancia = new Chart(ctx, {
    type: "line",
    data: {
      labels: meses,
      datasets: [
        {
          label: "Receita Mensal (R$)",
          data: valores,
          borderColor: "#2563eb",
          backgroundColor: "#93c5fd80",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => "R$ " + ctx.raw.toLocaleString("pt-BR"),
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (v) => "R$ " + v.toLocaleString("pt-BR"),
          },
        },
      },
    },
  });
}

window.addEventListener("load", gerarRelatorios);
