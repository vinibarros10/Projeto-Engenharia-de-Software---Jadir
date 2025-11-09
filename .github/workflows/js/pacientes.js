
// pacientes.js - CRUD paciente
let pacientes = JSON.parse(localStorage.getItem('pacientes') || '[]');
const form = document.getElementById('formPaciente');
const lista = document.getElementById('listaPacientes');

function carregarPacientes(){
  if(!verificarLogin()) return;
  pacientes = JSON.parse(localStorage.getItem('pacientes') || '[]');
  const filtro = (document.getElementById('filtroPaciente')||{}).value || '';
  if(!lista) return;
  lista.innerHTML = '';
  pacientes.forEach((p,i)=>{
    if(filtro && !(p.nome.toLowerCase().includes(filtro.toLowerCase()) || (p.cpf||'').includes(filtro))) return;
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${p.nome}</td><td>${p.cpf||''}</td><td>${p.telefone||''}</td><td>${p.nascimento||''}</td>
      <td>
        <button onclick="editarPaciente(${i})">✏️</button>
        <button onclick="removerPaciente(${i})">🗑️</button>
        <button onclick="verProntuario(${i})">📋</button>
      </td>`;
    lista.appendChild(tr);
  });
}

if(form){
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const nome = document.getElementById('nome').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const nascimento = document.getElementById('nascimento').value || '';
    const observacoes = document.getElementById('observacoes').value || '';
    if(!nome) return alert('Nome é obrigatório');
    pacientes.push({id:Date.now(), nome, cpf, telefone, nascimento, observacoes, historico:[]});
    localStorage.setItem('pacientes', JSON.stringify(pacientes));
    form.reset();
    carregarPacientes();
    alert('Paciente salvo.');
  });
}

function removerPaciente(i){
  if(!confirm('Remover paciente?')) return;
  pacientes.splice(i,1);
  localStorage.setItem('pacientes', JSON.stringify(pacientes));
  carregarPacientes();
}

function editarPaciente(i){
  const p = pacientes[i];
  const nome = prompt('Nome', p.nome);
  if(nome) { p.nome = nome; localStorage.setItem('pacientes', JSON.stringify(pacientes)); carregarPacientes(); }
}

function verProntuario(i){
  const p = pacientes[i];
  let txt = `Prontuário: ${p.nome}\nCPF: ${p.cpf || ''}\nTelefone: ${p.telefone || ''}\nNascimento: ${p.nascimento || ''}\nObservações:\n${p.observacoes||'--'}`;
  txt += '\n\nHistórico:\n' + ((p.historico||[]).map(h=>`${h.data} - ${h.procedimento} (${h.dentista||'--'})`).join('\n') || 'Nenhum');
  alert(txt);
}

window.carregarPacientes = carregarPacientes;
window.pacientes = pacientes;

const email = document.getElementById('email').value;
const endereco = document.getElementById('endereco').value;
pacientes.push({ id: Date.now(), nome, cpf, telefone, nascimento, email, endereco, observacoes, historico: [] });
