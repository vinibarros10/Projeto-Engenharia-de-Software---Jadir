// ==============================
// Dentistas - Smile Up
// ==============================

let editDentistaIndex = null;

// Salvar ou atualizar dentista
function salvarDentista(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const cro = document.getElementById("cro").value.trim();
  const especialidade = document.getElementById("especialidade").value.trim();
  const status = document.getElementById("status").value;

  if (!nome || !cro || !especialidade) {
    alert("Preencha todos os campos obrigatórios!");
    return;
  }

  let dentistas = JSON.parse(localStorage.getItem("dentistas") || "[]");

  if (editDentistaIndex !== null) {
    // Atualizar
    dentistas[editDentistaIndex] = { nome, cro, especialidade, status };
    editDentistaIndex = null;
  } else {
    // Verificar duplicidade de CRO
    if (dentistas.some(d => d.cro === cro)) {
      alert("Já existe um dentista com este CRO!");
      return;
    }

    // Adicionar novo
    dentistas.push({ nome, cro, especialidade, status });
  }

  localStorage.setItem("dentistas", JSON.stringify(dentistas));
  document.getElementById("formDentista").reset();
  carregarDentistas();
}

// Carregar dentistas
function carregarDentistas() {
  const dentistas = JSON.parse(localStorage.getItem("dentistas") || "[]");
  const lista = document.getElementById("listaDentistas");
  lista.innerHTML = "";

  if (dentistas.length === 0) {
    lista.innerHTML = `<tr><td colspan="5" class="text-center text-muted">Nenhum dentista cadastrado</td></tr>`;
    return;
  }

  dentistas.forEach((d, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${d.nome}</td>
      <td>${d.cro}</td>
      <td>${d.especialidade}</td>
      <td>${d.status}</td>
      <td style="text-align:center;">
        <button class="btn btn-warning btn-sm" onclick="editarDentista(${i})">✏️</button>
        <button class="btn btn-danger btn-sm" onclick="removerDentista(${i})">🗑️</button>
      </td>
    `;
    lista.appendChild(tr);
  });
}

// Editar dentista
function editarDentista(index) {
  const dentistas = JSON.parse(localStorage.getItem("dentistas") || "[]");
  const d = dentistas[index];

  document.getElementById("nome").value = d.nome;
  document.getElementById("cro").value = d.cro;
  document.getElementById("especialidade").value = d.especialidade;
  document.getElementById("status").value = d.status;

  editDentistaIndex = index;
}

// Remover dentista
function removerDentista(index) {
  if (!confirm("Deseja realmente excluir este dentista?")) return;
  const dentistas = JSON.parse(localStorage.getItem("dentistas") || "[]");
  dentistas.splice(index, 1);
  localStorage.setItem("dentistas", JSON.stringify(dentistas));
  carregarDentistas();
}

// Inicialização
window.addEventListener("load", () => {
  verificarLogin();
  carregarDentistas();
});

document.getElementById("formDentista").addEventListener("submit", salvarDentista);
