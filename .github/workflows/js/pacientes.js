// ==============================
// Pacientes - Smile Up
// ==============================

let editIndex = null;

function formatarCPF(cpf) {
  cpf = cpf.replace(/\D/g, "");
  if (cpf.length > 11) cpf = cpf.substring(0, 11);
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatarData(data) {
  if (!data) return "";
  const d = new Date(data);
  if (isNaN(d)) return data;
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

// Salvar ou atualizar paciente
function salvarPaciente(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const cpf = document.getElementById("cpf").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const endereco = document.getElementById("endereco").value.trim();
  const nascimento = document.getElementById("nascimento").value.trim();
  const observacoes = document.getElementById("observacoes").value.trim();

  if (!nome || !cpf || !telefone || !nascimento || !endereco) {
    alert("Preencha todos os campos obrigatórios!");
    return;
  }

  let pacientes = JSON.parse(localStorage.getItem("pacientes") || "[]");

  if (editIndex !== null) {
    pacientes[editIndex] = { nome, cpf, telefone, endereco, nascimento, observacoes };
    editIndex = null;
  } else {
    if (pacientes.some(p => p.cpf === cpf)) {
      alert("Já existe um paciente com este CPF!");
      return;
    }
    pacientes.push({ nome, cpf, telefone, endereco, nascimento, observacoes });
  }

  localStorage.setItem("pacientes", JSON.stringify(pacientes));
  document.getElementById("formPaciente").reset();
  carregarPacientes();
}

// Carregar pacientes
function carregarPacientes() {
  const pacientes = JSON.parse(localStorage.getItem("pacientes") || "[]");
  const filtro = document.getElementById("filtroPaciente").value.toLowerCase();
  const lista = document.getElementById("listaPacientes");
  lista.innerHTML = "";

  const filtrados = pacientes.filter(p =>
    p.nome.toLowerCase().includes(filtro) || p.cpf.includes(filtro)
  );

  if (filtrados.length === 0) {
    lista.innerHTML = `<tr><td colspan="6" class="text-center text-muted">Nenhum paciente encontrado</td></tr>`;
    return;
  }

  filtrados.forEach((p, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.nome}</td>
      <td>${formatarCPF(p.cpf)}</td>
      <td>${p.telefone}</td>
      <td>${p.endereco}</td>
      <td>${formatarData(p.nascimento)}</td>
      <td style="text-align:center;">
        <button class="btn btn-warning btn-sm" onclick="editarPaciente(${i})">✏️</button>
        <button class="btn btn-danger btn-sm" onclick="removerPaciente(${i})">🗑️</button>
      </td>
    `;
    lista.appendChild(tr);
  });
}

function editarPaciente(index) {
  const pacientes = JSON.parse(localStorage.getItem("pacientes") || "[]");
  const p = pacientes[index];

  document.getElementById("nome").value = p.nome;
  document.getElementById("cpf").value = p.cpf;
  document.getElementById("telefone").value = p.telefone;
  document.getElementById("endereco").value = p.endereco;
  document.getElementById("nascimento").value = p.nascimento;
  document.getElementById("observacoes").value = p.observacoes;

  editIndex = index;
}

function removerPaciente(index) {
  if (!confirm("Deseja realmente excluir este paciente?")) return;
  const pacientes = JSON.parse(localStorage.getItem("pacientes") || "[]");
  pacientes.splice(index, 1);
  localStorage.setItem("pacientes", JSON.stringify(pacientes));
  carregarPacientes();
}

window.addEventListener("load", () => {
  verificarLogin();
  carregarPacientes();
});

document.getElementById("formPaciente").addEventListener("submit", salvarPaciente);
