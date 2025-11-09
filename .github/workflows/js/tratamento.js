// tratamentos.js - gerenciamento de tratamentos
let tratamentos = JSON.parse(localStorage.getItem('tratamentos') || '[]');
const formT = document.getElementById('formTratamento');
const listaT = document.getElementById('listaTratamentos');

if (formT) {
  formT.addEventListener('submit', e => {
    e.preventDefault();
    const paciente = document.getElementById('pacienteTrat').value;
    const dentista = document.getElementById('dentistaTrat').value;
    const descricao = document.getElementById('descricaoTrat').value.trim();
    const custo = parseFloat(document.getElementById('custoTrat').value || 0);
    const aprovado = document.getElementById('aprovadoTrat').value === 'true';
    if (!paciente || !dentista || !descricao) return alert('Preencha todos os campos obrigatórios.');
    tratamentos.push({
      id: Date.now(),
      paciente, dentista, descricao,
      custo_estimado: custo, aprovado
    });
    localStorage.setItem('tratamentos', JSON.stringify(tratamentos));
    formT.reset();
    listarTratamentos();
    alert('Tratamento registrado com sucesso.');
  });
}

function listarTratamentos() {
  tratamentos = JSON.parse(localStorage.getItem('tratamentos') || '[]');
  if (!listaT) return;
  listaT.innerHTML = '';
  tratamentos.forEach((t, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${t.paciente}</td>
      <td>${t.dentista}</td>
      <td>${t.descricao}</td>
      <td>R$ ${t.custo_estimado.toFixed(2).replace('.', ',')}</td>
      <td>${t.aprovado ? '✅ Aprovado' : '⏳ Pendente'}</td>
      <td>
        <button onclick="aprovarTratamento(${i})">✔️</button>
        <button onclick="removerTratamento(${i})">🗑️</button>
      </td>`;
    listaT.appendChild(tr);
  });
}

function aprovarTratamento(i) {
  tratamentos[i].aprovado = true;
  localStorage.setItem('tratamentos', JSON.stringify(tratamentos));
  listarTratamentos();
}

function removerTratamento(i) {
  if (!confirm('Deseja remover este tratamento?')) return;
  tratamentos.splice(i, 1);
  localStorage.setItem('tratamentos', JSON.stringify(tratamentos));
  listarTratamentos();
}

window.listarTratamentos = listarTratamentos;

// ---- Funções auxiliares para preencher selects ----
function carregarPacientesOptions() {
  const pacientes = JSON.parse(localStorage.getItem('pacientes') || '[]');
  const select = document.getElementById('pacienteTrat');
  if (!select) return;
  select.innerHTML = '<option value="">-- selecionar paciente --</option>';
  pacientes.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.nome;
    opt.textContent = p.nome;
    select.appendChild(opt);
  });
}

function carregarDentistasOptions() {
  const dentistas = JSON.parse(localStorage.getItem('dentistas') || '[]');
  const select = document.getElementById('dentistaTrat');
  if (!select) return;
  select.innerHTML = '<option value="">-- selecionar dentista --</option>';
  dentistas.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.nome;
    opt.textContent = `${d.nome} (${d.especialidade || 'Geral'})`;
    select.appendChild(opt);
  });
}
